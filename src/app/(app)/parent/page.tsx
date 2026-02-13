import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { checkQuotas } from "@/lib/quotas";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsageMeter } from "@/components/shared/usage-meter";
import { Users, AlertTriangle, Activity, CreditCard } from "lucide-react";

export default async function ParentDashboard() {
  const session = await getServerAuthSession();
  const userId = session?.user?.id;
  if (!userId) return null;

  const parent = await prisma.parentProfile.findFirst({
    where: { userId },
    include: { children: true, subscriptions: { include: { plan: true } } }
  });

  if (!parent) return <div>پروفایل یافت نشد.</div>;

  const incidents = await prisma.safetyIncident.findMany({
    where: { parentId: parent.id },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  // Calculate usage stats (mock logic for now based on existing checkQuotas)
  const childQuotas = await Promise.all(parent.children.map(async (child) => {
    const quota = await checkQuotas(parent.id, child.id);
    return { child, quota };
  }));

  const activePlan = parent.subscriptions?.[0]?.plan?.name ?? "رایگان";
  const planLimit = 50; // Example limit, should come from plan details

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="کودکان فعال"
          value={parent.children.filter(c => c.isActive).length.toString()}
          icon={<Users className="w-5 h-5 text-primary" />}
        />
        <StatsCard
          title="هشدارهای ایمنی"
          value={incidents.length.toString()}
          icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
          description="در هفته اخیر"
        />
        <StatsCard
          title="پیام‌های امروز"
          value={childQuotas.reduce((acc, curr) => acc + (curr.quota.usage?.messagesToday || 0), 0).toString()}
          icon={<Activity className="w-5 h-5 text-green-500" />}
        />
        <StatsCard
          title="اشتراک فعلی"
          value={activePlan}
          icon={<CreditCard className="w-5 h-5 text-purple-500" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">وضعیت کودکان</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {childQuotas.map(({ child, quota }) => (
              <Card key={child.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">
                    {child.nickname}
                  </CardTitle>
                  <Badge variant={child.isActive ? "secondary" : "destructive"}>
                    {child.isActive ? "فعال" : "توقف"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="mt-4 space-y-4">
                    <UsageMeter
                      current={quota.usage?.messagesToday || 0}
                      max={planLimit}
                      label="پیام‌های امروز"
                    />
                    <div className="flex justify-end">
                      <Button asChild size="sm" variant="outline">
                        <Link href="/profiles/manage">تنظیمات</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {childQuotas.length === 0 && (
              <Card className="col-span-full border-dashed p-8 text-center text-muted-foreground">
                هنوز کودکی اضافه نشده است.
                <div className="mt-4">
                  <Button asChild>
                    <Link href="/profiles/new">افزودن کودک جدید</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">آخرین گزارش‌ها</h2>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base">رویدادهای ایمنی</CardTitle>
              <CardDescription>موارد نیازمند توجه شما</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {incidents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">همه چیز امن است! ✅</p>
              ) : (
                incidents.map((incident) => (
                  <div key={incident.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{incident.type}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {incident.contentExcerpt}
                      </p>
                      <p className="text-[10px] text-muted-foreground/50">
                        {new Date(incident.createdAt).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <Button asChild variant="ghost" className="w-full text-xs" size="sm">
                <Link href="/parent/reports">مشاهده همه گزارش‌ها</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
