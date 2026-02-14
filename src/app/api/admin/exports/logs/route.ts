import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.logEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 2000
  });

  const header = "createdAt,eventType,severity,userId,childId,message";
  const csv = [
    header,
    ...rows.map((row) =>
      [
        row.createdAt.toISOString(),
        row.eventType,
        row.severity,
        row.userId ?? "",
        row.childId ?? "",
        (row.message ?? "").replace(/,/g, " ")
      ].join(",")
    )
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=logs.csv"
    }
  });
}
