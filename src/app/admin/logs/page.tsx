import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminLogsPage({
  searchParams
}: {
  searchParams: { event?: string; userId?: string; childId?: string; severity?: string }
}) {
  const where: any = {};
  if (searchParams.event) where.eventType = { contains: searchParams.event };
  if (searchParams.userId) where.userId = searchParams.userId;
  if (searchParams.childId) where.childId = searchParams.childId;
  if (searchParams.severity) where.severity = searchParams.severity as any;

  const logs = await prisma.logEvent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle>لاگ‌های سیستم</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="grid gap-2 md:grid-cols-4">
          <Input name="event" placeholder="eventType" defaultValue={searchParams.event} />
          <Input name="userId" placeholder="userId" defaultValue={searchParams.userId} />
          <Input name="childId" placeholder="childId" defaultValue={searchParams.childId} />
          <Input name="severity" placeholder="INFO/WARN/ERROR" defaultValue={searchParams.severity} />
          <div className="md:col-span-4 flex flex-wrap gap-2">
            <Button type="submit">فیلتر</Button>
            <Button asChild variant="outline">
              <Link href="/api/admin/exports/logs">خروجی CSV</Link>
            </Button>
          </div>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>زمان</TableHead>
              <TableHead>نوع</TableHead>
              <TableHead>شدت</TableHead>
              <TableHead>کاربر</TableHead>
              <TableHead>کودک</TableHead>
              <TableHead>پیام</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.createdAt).toLocaleString("fa-IR")}</TableCell>
                <TableCell>{log.eventType}</TableCell>
                <TableCell>{log.severity}</TableCell>
                <TableCell>{log.userId ?? "-"}</TableCell>
                <TableCell>{log.childId ?? "-"}</TableCell>
                <TableCell className="max-w-[280px] truncate">{log.message ?? "-"}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                  لاگی یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
