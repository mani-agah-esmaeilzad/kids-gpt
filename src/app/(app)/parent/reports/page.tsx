import { format, subDays } from "date-fns";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { UsageChart } from "@/components/usage-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default async function ReportsPage() {
  const session = await getServerAuthSession();
  const parent = await prisma.parentProfile.findFirst({
    where: { userId: session?.user?.id }
  });

  const days = Array.from({ length: 7 }).map((_, idx) => subDays(new Date(), 6 - idx));
  // Mock data for now if database is empty or logic is complex to setup in test
  const ledger = await prisma.usageLedger.findMany({
    where: { parentId: parent?.id },
    orderBy: { date: "asc" }
  });

  const chartData = days.map((day) => {
    const dayKey = format(day, "yyyy-MM-dd");
    const entries = ledger.filter((entry) => format(entry.date, "yyyy-MM-dd") === dayKey);
    const messages = entries.reduce((sum, entry) => sum + entry.messages, 0);
    const tokens = entries.reduce((sum, entry) => sum + entry.tokens, 0);
    // Use Persian Date formatted if possible, but keeping simple for now
    return { label: format(day, "MM/dd"), messages, tokens };
  });

  const incidents = await prisma.safetyIncident.findMany({
    where: { parentId: parent?.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">گزارشات و ایمنی</h1>
        <p className="text-muted-foreground">بررسی فعالیت‌ها و وضعیت ایمنی کودکان</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>روند فعالیت هفتگی</CardTitle>
            <CardDescription>تعداد پیام‌های رد و بدل شده</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="shadow-soft flex flex-col h-[400px]">
          <CardHeader>
            <CardTitle>رویدادهای ایمنی اخیر</CardTitle>
            <CardDescription>لیست تمام هشدارهای ثبت شده</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full px-6 pb-6">
              <div className="space-y-4">
                {incidents.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <CheckCircle className="w-10 h-10 mb-2 text-green-500/50" />
                    <p>هیچ مورد نگران‌کننده‌ای ثبت نشده است.</p>
                  </div>
                )}
                {incidents.map((incident) => (
                  <div key={incident.id} className="flex gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${incident.action === "ESCALATE" ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{incident.type}</p>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(incident.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        "{incident.contentExcerpt}"
                      </p>
                      <div className="pt-2">
                        <Badge variant="outline" className="text-[10px]">
                          اقدام: {incident.action === "ESCALATE" ? "اطلاع به والدین" : "مسدودسازی"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
