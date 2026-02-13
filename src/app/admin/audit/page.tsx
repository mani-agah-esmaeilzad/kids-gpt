import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 30
  });

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle>لاگ‌ها</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>زمان</TableHead>
              <TableHead>عملیات</TableHead>
              <TableHead>جزئیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.createdAt.toISOString()}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{JSON.stringify(log.metadata)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
