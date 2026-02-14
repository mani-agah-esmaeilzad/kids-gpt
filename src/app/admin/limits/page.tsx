import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/lib/auth";

async function updateOverrides(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "");
  const multiplier = Number(formData.get("multiplier") ?? "1");
  const isBanned = formData.get("isBanned") === "on";
  const banUntil = String(formData.get("banUntil") ?? "");
  const parent = await prisma.parentProfile.findFirst({
    where: { user: { email } }
  });
  if (!parent) return;
  const prefs = (parent.preferences as any) ?? {};
  await prisma.parentProfile.update({
    where: { id: parent.id },
    data: {
      preferences: {
        ...prefs,
        rateLimitMultiplier: multiplier,
        isBanned,
        banUntil: banUntil || null
      }
    }
  });

  const session = await getServerAuthSession();
  if (session?.user?.id) {
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: "rate_limit.override",
        metadata: { parentId: parent.id, multiplier, isBanned, banUntil }
      }
    });
  }
}

export default async function AdminLimitsPage() {
  const [rateConfig, plans, parents] = await Promise.all([
    prisma.appConfig.findUnique({ where: { key: "rate.limits" } }),
    prisma.plan.findMany({ orderBy: { priceMonthlyToman: "asc" } }),
    prisma.parentProfile.findMany({
      include: { user: true },
      take: 20,
      orderBy: { updatedAt: "desc" }
    })
  ]);

  const rateValue = (rateConfig?.value as any) ?? {};

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>Rate Limit جهانی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>globalMultiplier: {rateValue.globalMultiplier ?? 1}</div>
          <div>emergencyThrottle: {String(rateValue.emergencyThrottle ?? false)}</div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>تنظیمات پلن‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>پلن</TableHead>
                <TableHead>parentRPM</TableHead>
                <TableHead>childRPM</TableHead>
                <TableHead>concurrency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                const limits = (plan.quotasJson as any)?.rateLimits ?? {};
                return (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.nameFa}</TableCell>
                    <TableCell>{limits.parentRPM ?? "-"}</TableCell>
                    <TableCell>{limits.childRPM ?? "-"}</TableCell>
                    <TableCell>{limits.childConcurrency ?? "-"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>Override کاربران</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={updateOverrides} className="grid gap-3 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <Label>ایمیل والد</Label>
              <Input name="email" required />
            </div>
            <div className="space-y-2">
              <Label>Multiplier</Label>
              <Input name="multiplier" defaultValue="1" />
            </div>
            <div className="space-y-2">
              <Label>Ban Until (YYYY-MM-DD)</Label>
              <Input name="banUntil" />
            </div>
            <div className="md:col-span-4 flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isBanned" />
                مسدود شود
              </label>
              <Button type="submit">اعمال</Button>
            </div>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کاربر</TableHead>
                <TableHead>Multiplier</TableHead>
                <TableHead>مسدود</TableHead>
                <TableHead>Ban Until</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents.map((parent) => {
                const prefs = (parent.preferences as any) ?? {};
                return (
                  <TableRow key={parent.id}>
                    <TableCell>{parent.user.email}</TableCell>
                    <TableCell>{prefs.rateLimitMultiplier ?? 1}</TableCell>
                    <TableCell>{String(prefs.isBanned ?? false)}</TableCell>
                    <TableCell>{prefs.banUntil ?? "-"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
