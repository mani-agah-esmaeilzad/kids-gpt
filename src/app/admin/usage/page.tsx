import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminUsagePage() {
  const [ledger, perModel, topParents] = await Promise.all([
    prisma.usageLedger.findMany({ orderBy: { date: "desc" }, take: 20 }),
    prisma.usageLedger.groupBy({ by: ["modelUsed"], _sum: { totalTokens: true, estimatedTokenCostToman: true } }),
    prisma.usageLedger.groupBy({
      by: ["parentId"],
      _sum: { totalTokens: true },
      orderBy: { _sum: { totalTokens: "desc" } },
      take: 5
    })
  ]);

  const parentIds = topParents.map((row) => row.parentId);
  const parents = await prisma.parentProfile.findMany({
    where: { id: { in: parentIds } },
    include: { user: true }
  });
  const parentMap = new Map(parents.map((parent) => [parent.id, parent.user.email]));

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>مصرف و هزینه</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>تاریخ</TableHead>
                <TableHead>پیام</TableHead>
                <TableHead>توکن</TableHead>
                <TableHead>مدل</TableHead>
                <TableHead>هزینه (تومان)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date.toISOString().slice(0, 10)}</TableCell>
                  <TableCell>{entry.messagesCount}</TableCell>
                  <TableCell>{entry.totalTokens}</TableCell>
                  <TableCell>{entry.modelUsed ?? "نامشخص"}</TableCell>
                  <TableCell>{entry.estimatedTokenCostToman.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>تفکیک مدل‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {perModel.map((row) => (
            <div key={row.modelUsed ?? "unknown"} className="flex items-center justify-between">
              <span>{row.modelUsed ?? "نامشخص"}</span>
              <span>{row._sum.totalTokens ?? 0} توکن</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>کاربران پرمصرف</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {topParents.map((row) => (
            <div key={row.parentId} className="flex items-center justify-between">
              <span>{parentMap.get(row.parentId) ?? row.parentId}</span>
              <span>{row._sum.totalTokens ?? 0} توکن</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
