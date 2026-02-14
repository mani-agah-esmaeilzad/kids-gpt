import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminUserDetailPage({
  params
}: {
  params: { id: string };
}) {
  const parent = await prisma.parentProfile.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      children: true,
      subscriptions: { include: { plan: true } }
    }
  });
  if (!parent) return <div>کاربر یافت نشد.</div>;

  const [usage, payments] = await Promise.all([
    prisma.usageLedger.findMany({
      where: { parentId: parent.id },
      orderBy: { date: "desc" },
      take: 20
    }),
    prisma.payment.findMany({
      where: { userId: parent.userId },
      orderBy: { createdAt: "desc" },
      take: 20
    })
  ]);

  const subscription = parent.subscriptions[0];

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>جزئیات کاربر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>ایمیل: {parent.user.email}</div>
          <div>اشتراک: {subscription?.plan?.nameFa ?? "-"}</div>
          <div>وضعیت: {subscription?.status ?? "-"}</div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>کودکان</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>گروه سنی</TableHead>
                <TableHead>فعال</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parent.children.map((child) => (
                <TableRow key={child.id}>
                  <TableCell>{child.nickname}</TableCell>
                  <TableCell>{child.ageGroup}</TableCell>
                  <TableCell>{child.isActive ? "بله" : "خیر"}</TableCell>
                </TableRow>
              ))}
              {parent.children.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                    کودکی ثبت نشده است.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 bg-card">
          <CardHeader>
            <CardTitle>مصرف اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>تاریخ</TableHead>
                  <TableHead>پیام</TableHead>
                  <TableHead>توکن</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usage.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{new Date(row.date).toLocaleDateString("fa-IR")}</TableCell>
                    <TableCell>{row.messagesCount}</TableCell>
                    <TableCell>{row.totalTokens}</TableCell>
                  </TableRow>
                ))}
                {usage.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                      مصرفی ثبت نشده است.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card">
          <CardHeader>
            <CardTitle>پرداخت‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>تاریخ</TableHead>
                  <TableHead>مبلغ</TableHead>
                  <TableHead>وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.createdAt).toLocaleDateString("fa-IR")}</TableCell>
                    <TableCell>{payment.amountToman.toLocaleString()}</TableCell>
                    <TableCell>{payment.status}</TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                      پرداختی ثبت نشده است.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
