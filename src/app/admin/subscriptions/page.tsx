import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AdminActivateSubscription } from "@/components/admin-activate-subscription";
import { getServerAuthSession } from "@/lib/auth";

async function updateStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;
  await prisma.subscription.update({
    where: { id },
    data: { status: status as any }
  });
  const session = await getServerAuthSession();
  if (session?.user?.id) {
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: "subscription.status",
        metadata: { id, status }
      }
    });
  }
}

async function extendSubscription(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const subscription = await prisma.subscription.findUnique({ where: { id } });
  if (!subscription) return;
  const current = subscription.renewAt ?? new Date();
  const next = new Date(current.getTime() + 30 * 24 * 60 * 60 * 1000);
  await prisma.subscription.update({
    where: { id },
    data: { renewAt: next, status: "ACTIVE" }
  });
  const session = await getServerAuthSession();
  if (session?.user?.id) {
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: "subscription.extend",
        metadata: { id, renewAt: next }
      }
    });
  }
}

export default async function AdminSubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    include: { plan: true, parent: { include: { user: true } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle>اشتراک‌ها</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>کاربر</TableHead>
              <TableHead>پلن</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>تمدید</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.parent.user.email}</TableCell>
                <TableCell>{sub.plan.nameFa}</TableCell>
                <TableCell>{sub.status}</TableCell>
                <TableCell>{sub.renewAt ? new Date(sub.renewAt).toLocaleDateString("fa-IR") : "-"}</TableCell>
                <TableCell className="space-x-2">
                  <div className="flex flex-wrap gap-2">
                    <AdminActivateSubscription subscriptionId={sub.id} />
                    <form action={extendSubscription}>
                      <input type="hidden" name="id" value={sub.id} />
                      <Button size="sm" variant="outline">تمدید ۳۰ روز</Button>
                    </form>
                    <form action={updateStatus}>
                      <input type="hidden" name="id" value={sub.id} />
                      <input type="hidden" name="status" value="CANCELED" />
                      <Button size="sm" variant="destructive">لغو</Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {subscriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                  اشتراکی یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
