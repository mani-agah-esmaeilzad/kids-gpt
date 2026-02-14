import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getServerAuthSession } from "@/lib/auth";

async function createCost(formData: FormData) {
  "use server";
  const category = String(formData.get("category") ?? "");
  const amount = Number(formData.get("amountToman") ?? "0");
  const notes = String(formData.get("notes") ?? "");
  if (!category || !amount) return;
  await prisma.costLedger.create({
    data: {
      category: category as any,
      amountToman: amount,
      notes
    }
  });

  const session = await getServerAuthSession();
  if (session?.user?.id) {
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: "cost.create",
        metadata: { category, amountToman: amount }
      }
    });
  }
}

export default async function AdminCostsPage() {
  const costs = await prisma.costLedger.findMany({
    orderBy: { date: "desc" },
    take: 50
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.4fr]">
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>هزینه‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>تاریخ</TableHead>
                <TableHead>دسته</TableHead>
                <TableHead>مبلغ</TableHead>
                <TableHead>یادداشت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costs.map((cost) => (
                <TableRow key={cost.id}>
                  <TableCell>{new Date(cost.date).toLocaleDateString("fa-IR")}</TableCell>
                  <TableCell>{cost.category}</TableCell>
                  <TableCell>{cost.amountToman.toLocaleString()} تومان</TableCell>
                  <TableCell>{cost.notes ?? "-"}</TableCell>
                </TableRow>
              ))}
              {costs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    هزینه‌ای ثبت نشده است.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>ثبت هزینه</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCost} className="space-y-3">
            <div className="space-y-2">
              <Label>دسته</Label>
              <Input name="category" placeholder="SERVER / PAYMENT / MARKETING / OTHER" required />
            </div>
            <div className="space-y-2">
              <Label>مبلغ (تومان)</Label>
              <Input name="amountToman" required />
            </div>
            <div className="space-y-2">
              <Label>یادداشت</Label>
              <Input name="notes" />
            </div>
            <Button className="w-full" type="submit">ثبت</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
