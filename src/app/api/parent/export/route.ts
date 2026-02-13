import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parent = await prisma.parentProfile.findFirst({
    where: { userId: session.user.id },
    include: { children: true }
  });
  if (!parent) {
    return NextResponse.json({ error: "Parent not found" }, { status: 404 });
  }

  const incidents = await prisma.safetyIncident.findMany({
    where: { parentId: parent.id }
  });

  const header = "type,action,childId,createdAt,excerpt";
  const csv = [
    header,
    ...incidents.map((incident) =>
      [
        incident.type,
        incident.action,
        incident.childId,
        incident.createdAt.toISOString(),
        incident.contentExcerpt.replace(/\n/g, " ")
      ].join(",")
    )
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=gptkids-incidents.csv"
    }
  });
}
