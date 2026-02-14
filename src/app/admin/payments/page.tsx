import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: { user: true, subscription: { include: { plan: true } } },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle>پرداخت‌ها</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>کاربر</TableHead>
              <TableHead>پلن</TableHead>
              <TableHead>مبلغ</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>ارائه‌دهنده</TableHead>
              <TableHead>تاریخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.user.email}</TableCell>
                <TableCell>{payment.subscription?.plan?.nameFa ?? "-"}</TableCell>
                <TableCell>{payment.amountToman.toLocaleString()} تومان</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell>{payment.provider}</TableCell>
                <TableCell>{new Date(payment.createdAt).toLocaleDateString("fa-IR")}</TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                  پرداختی ثبت نشده است.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
