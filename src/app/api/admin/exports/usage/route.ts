import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.usageLedger.findMany({
    orderBy: { date: "desc" },
    take: 1000
  });

  const header = "date,parentId,childId,messages,tokens,model,outcome";
  const csv = [
    header,
    ...rows.map((row) =>
      [
        row.date.toISOString(),
        row.parentId,
        row.childId ?? "",
        row.messages,
        row.tokens,
        row.model ?? "",
        row.outcome ?? ""
      ].join(",")
    )
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=usage.csv"
    }
  });
}
