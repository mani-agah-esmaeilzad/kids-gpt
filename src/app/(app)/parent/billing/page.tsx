import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PricingCards } from "@/components/pricing-cards";
import { Badge } from "@/components/ui/badge";
import { CreditCard, FileText, CheckCircle2 } from "lucide-react";

export default async function BillingPage() {
  const session = await getServerAuthSession();
  const parent = await prisma.parentProfile.findFirst({
    where: { userId: session?.user?.id },
    include: { subscriptions: { include: { plan: true } } }
  });

  const subscription = parent?.subscriptions?.[0];
  const activePlanName = subscription?.plan?.name ?? "رایگان";

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
              <h2 className="text-lg font-semibold">اشتراک یاریگر: {activePlanName}</h2>
              <p className="text-sm text-muted-foreground">وضعیت: <Badge variant="outline" className="ml-1">{subscription?.status ?? "فعال"}</Badge></p>
            </div>
          </div>
          {/* <Button variant="outline">لغو اشتراک</Button> */}
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
              <div className="flex items-center justify-between p-4 bg-muted/20">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">صورت‌حساب #INV-001</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>۱۴۰۲/۱۱/۰۱</span>
                  <span>۰ تومان</span>
                  <Badge variant="secondary">پرداخت شده</Badge>
                </div>
              </div>
            </div>
            <div className="p-8 text-center text-muted-foreground text-sm">
              تراکنش دیگری یافت نشد.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
