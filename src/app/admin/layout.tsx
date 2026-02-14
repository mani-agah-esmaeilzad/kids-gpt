import { getServerAuthSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SignOutButton } from "@/components/signout-button";
import { AdminCommandPalette } from "@/components/admin-command";
import { ThemeToggle } from "@/components/theme-toggle";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const [revenueSum, tokenCostSum, costByCategory] = await Promise.all([
    prisma.revenueLedger.aggregate({ _sum: { amountToman: true } }),
    prisma.usageLedger.aggregate({ _sum: { estimatedTokenCostToman: true } }),
    prisma.costLedger.groupBy({ by: ["category"], _sum: { amountToman: true } })
  ]);

  const totalRevenue = revenueSum._sum.amountToman ?? 0;
  const tokenCost = tokenCostSum._sum.estimatedTokenCostToman ?? 0;
  const serverCost = costByCategory.find((row) => row.category === "SERVER")?._sum.amountToman ?? 0;
  const paymentCost = costByCategory.find((row) => row.category === "PAYMENT")?._sum.amountToman ?? 0;
  const marketingCost = costByCategory.find((row) => row.category === "MARKETING")?._sum.amountToman ?? 0;
  const otherCost = costByCategory.find((row) => row.category === "OTHER")?._sum.amountToman ?? 0;
  const totalCost = tokenCost + serverCost + paymentCost + marketingCost + otherCost;
  const profit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? profit / totalRevenue : 1;
  const healthStatus = profit <= 0 ? "danger" : margin < 0.1 ? "warn" : "ok";

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 shrink-0 border-l bg-white dark:bg-slate-950 h-screen sticky top-0 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
              <span className="font-bold text-xl tracking-tight">پنل مدیریت</span>
            </div>
            <AdminSidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6">
            <div className="flex-1">
              <AdminCommandPalette />
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-sm font-medium">
                {session?.user?.email}
              </div>
              <SignOutButton />
            </div>
          </header>

          <main className="p-6 md:p-8 max-w-[1600px] mx-auto">
            <div className="mb-6">
              <div
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  healthStatus === "danger"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : healthStatus === "warn"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                وضعیت مالی:{" "}
                {healthStatus === "danger"
                  ? "زیان‌ده"
                  : healthStatus === "warn"
                    ? "هشدار حاشیه سود پایین"
                    : "سالم"}
                {" — "}
                درآمد {totalRevenue.toLocaleString()} تومان | هزینه‌ها{" "}
                {totalCost.toLocaleString()} تومان | سود {profit.toLocaleString()} تومان
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
