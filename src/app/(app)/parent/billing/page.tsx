import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PricingCards } from "@/components/pricing-cards";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2 } from "lucide-react";

export default async function BillingPage() {
  const session = await getServerAuthSession();
  const parent = await prisma.parentProfile.findFirst({
    where: { userId: session?.user?.id },
    include: { subscriptions: { include: { plan: true } }, user: true }
  });
  if (!parent) {
    return <div>پروفایل یافت نشد.</div>;
  }

  const subscription = parent?.subscriptions?.[0];
  const activePlanName = subscription?.plan?.nameFa ?? "بدون اشتراک";
  const payments = await prisma.payment.findMany({
    where: { userId: parent?.userId },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">مدیریت اشتراک</h1>
        <p className="text-muted-foreground">مشاهده پلن فعال و ارتقای حساب کاربری</p>
      </div>

      <Card className="shadow-soft bg-gradient-to-br from-white to-secondary/20">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">اشتراک فعال: {activePlanName}</h2>
              <p className="text-sm text-muted-foreground">
                وضعیت:{" "}
                <Badge variant="outline" className="ml-1">
                  {subscription?.status ?? "بدون اشتراک"}
                </Badge>
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <a href="/pricing">تغییر پلن</a>
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">انتخاب پلن مناسب</h2>
        <PricingCards />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">سابقه پرداخت‌ها</h2>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">پرداخت #{payment.id.slice(-6)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{new Date(payment.createdAt).toLocaleDateString("fa-IR")}</span>
                    <span>{payment.amountToman.toLocaleString()} تومان</span>
                    <Badge variant={payment.status === "PAID" ? "secondary" : "outline"}>
                      {payment.status === "PAID" ? "پرداخت شده" : payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {payments.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                تراکنشی یافت نشد.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
