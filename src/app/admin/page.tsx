import { prisma } from "@/lib/db";
import { format, subDays, startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UsageChart } from "@/components/usage-chart";
import { FinancialChart } from "@/components/admin/financial-chart";
import { Users, CreditCard, Activity, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

async function getStats() {
  const [activeSubs, usersCount, revenueSum, tokenCostSum, costSum, usageData, revenueRows, costRows, recentUsers, dauCount, churnCount, planGroups] = await Promise.all([
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.revenueLedger.aggregate({ _sum: { amountToman: true } }),
    prisma.usageLedger.aggregate({ _sum: { estimatedTokenCostToman: true } }),
    prisma.costLedger.aggregate({ _sum: { amountToman: true } }),
    prisma.usageLedger.findMany({
      orderBy: { date: "asc" },
      take: 30,
      select: { date: true, messagesCount: true, totalTokens: true, estimatedTokenCostToman: true }
    }),
    prisma.revenueLedger.findMany({ orderBy: { date: "asc" }, take: 30 }),
    prisma.costLedger.findMany({ orderBy: { date: "asc" }, take: 30 }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, email: true, createdAt: true }
    }),
    prisma.kidDeviceSession.count({
      where: { lastSeenAt: { gte: startOfDay(new Date()) } }
    }),
    prisma.subscription.count({
      where: { status: "CANCELED", updatedAt: { gte: subDays(new Date(), 30) } }
    }),
    prisma.subscription.groupBy({ by: ["planId"], _count: { planId: true } })
  ]);

  return {
    activeSubs,
    usersCount,
    totalRevenue: revenueSum._sum.amountToman ?? 0,
    tokenCost: tokenCostSum._sum.estimatedTokenCostToman ?? 0,
    otherCosts: costSum._sum.amountToman ?? 0,
    usageData,
    revenueRows,
    costRows,
    recentUsers,
    dauCount,
    churnCount,
    planGroups
  };
}

export default async function AdminOverviewPage() {
  const { activeSubs, usersCount, totalRevenue, tokenCost, otherCosts, usageData, revenueRows, costRows, recentUsers, dauCount, churnCount, planGroups } = await getStats();
  const plans = await prisma.plan.findMany();
  const planDistribution = planGroups.map((group) => ({
    name: plans.find((plan) => plan.id === group.planId)?.nameFa ?? group.planId,
    count: group._count.planId
  }));

  const chartData = usageData.map((entry) => ({
    label: format(entry.date, "MM/dd"),
    messages: entry.messagesCount,
    tokens: entry.totalTokens
  }));

  const financialData = chartData.map((item) => {
    const revenue = revenueRows
      .filter((row) => format(row.date, "MM/dd") === item.label)
      .reduce((sum, row) => sum + row.amountToman, 0);
    const otherCosts = costRows
      .filter((row) => format(row.date, "MM/dd") === item.label)
      .reduce((sum, row) => sum + row.amountToman, 0);
    const tokenCosts = usageData
      .filter((row) => format(row.date, "MM/dd") === item.label)
      .reduce((sum, row) => sum + (row.estimatedTokenCostToman ?? 0), 0);
    return { label: item.label, revenue, cost: otherCosts + tokenCosts };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">داشبورد مدیریت</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">دانلود گزارش</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="کاربران کل"
          value={usersCount.toString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          subtext="+10% نسبت به ماه قبل"
          className="bg-white dark:bg-slate-950"
        />
        <StatsCard
          title="اشتراک‌های فعال"
          value={activeSubs.toString()}
          icon={<CreditCard className="h-4 w-4 text-emerald-500" />}
          subtext="+5% نسبت به ماه قبل"
          className="bg-white dark:bg-slate-950"
        />
        <StatsCard
          title="DAU"
          value={dauCount.toString()}
          icon={<Users className="h-4 w-4 text-blue-500" />}
          subtext="فعال امروز"
          className="bg-white dark:bg-slate-950"
        />
        <StatsCard
          title="Churn"
          value={churnCount.toString()}
          icon={<Activity className="h-4 w-4 text-rose-500" />}
          subtext="۳۰ روز اخیر"
          className="bg-white dark:bg-slate-950"
        />
        <StatsCard
          title="درآمد کل"
          value={`${totalRevenue.toLocaleString()} تومان`}
          icon={<Box className="h-4 w-4 text-blue-500" />}
          subtext="جمع کل"
          className="bg-white dark:bg-slate-950"
        />
        <StatsCard
          title="هزینه توکن"
          value={`${tokenCost.toLocaleString()} تومان`}
          icon={<Activity className="h-4 w-4 text-orange-500" />}
          subtext="جمع کل"
          className="bg-white dark:bg-slate-950"
        />
        <StatsCard
          title="هزینه‌های دیگر"
          value={`${otherCosts.toLocaleString()} تومان`}
          icon={<Activity className="h-4 w-4 text-rose-500" />}
          subtext="سرور/پرداخت/مارکتینگ"
          className="bg-white dark:bg-slate-950"
        />
        <StatsCard
          title="مصرف توکن"
          value={chartData.reduce((acc, curr) => acc + curr.tokens, 0).toLocaleString()}
          icon={<Activity className="h-4 w-4 text-orange-500" />}
          subtext="در ۳۰ روز گذشته"
          className="bg-white dark:bg-slate-950"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-0 bg-white dark:bg-slate-950">
          <CardHeader>
            <CardTitle>روند مصرف</CardTitle>
            <CardDescription>
              تعداد پیام‌های روزانه در ۳۰ روز اخیر.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <UsageChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-0 bg-white dark:bg-slate-950">
          <CardHeader>
            <CardTitle>کاربران اخیر</CardTitle>
            <CardDescription>
              ۵ کاربر جدید ثبت‌نام کرده.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold ring-2 ring-white group-hover:ring-primary/20 transition-all">
                      {user.email?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-700">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                    جدید
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-0 bg-white dark:bg-slate-950">
        <CardHeader>
          <CardTitle>درآمد در برابر هزینه</CardTitle>
          <CardDescription>روند مالی ۳۰ روز گذشته</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <FinancialChart data={financialData} />
        </CardContent>
      </Card>

      <Card className="shadow-sm border-0 bg-white dark:bg-slate-950">
        <CardHeader>
          <CardTitle>توزیع پلن‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {planDistribution.map((row) => (
            <div key={row.name} className="flex items-center justify-between">
              <span>{row.name}</span>
              <span>{row.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, icon, subtext, className }: { title: string, value: string, icon: any, subtext: string, className?: string }) {
  return (
    <Card className={cn("shadow-sm border-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {subtext}
        </p>
      </CardContent>
    </Card>
  )
}
