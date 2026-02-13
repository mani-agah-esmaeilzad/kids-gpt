import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminUsagePage() {
  const [ledger, perModel] = await Promise.all([
    prisma.usageLedger.findMany({ orderBy: { date: "desc" }, take: 20 }),
    prisma.usageLedger.groupBy({ by: ["model"], _sum: { tokens: true } })
  ]);

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date.toISOString().slice(0, 10)}</TableCell>
                  <TableCell>{entry.messages}</TableCell>
                  <TableCell>{entry.tokens}</TableCell>
                  <TableCell>{entry.model}</TableCell>
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
            <div key={row.model ?? "unknown"} className="flex items-center justify-between">
              <span>{row.model ?? "نامشخص"}</span>
              <span>{row._sum.tokens ?? 0} توکن</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
