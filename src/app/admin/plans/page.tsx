import { z } from "zod";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getServerAuthSession } from "@/lib/auth";

const schema = z.object({
  key: z.string().min(2),
  nameFa: z.string().min(2),
  priceMonthlyToman: z.string(),
  maxChildren: z.string(),
  quotasJson: z.string(),
  featuresJson: z.string()
});

async function createPlan(formData: FormData) {
  "use server";
  const data = {
    key: String(formData.get("key") ?? ""),
    nameFa: String(formData.get("nameFa") ?? ""),
    priceMonthlyToman: String(formData.get("priceMonthlyToman") ?? "0"),
    maxChildren: String(formData.get("maxChildren") ?? "1"),
    quotasJson: String(formData.get("quotasJson") ?? "{}"),
    featuresJson: String(formData.get("featuresJson") ?? "{}")
  };
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");
  let quotas = {};
  let features = {};
  try {
    quotas = JSON.parse(parsed.data.quotasJson);
  } catch {
    quotas = {};
  }
  try {
    features = JSON.parse(parsed.data.featuresJson);
  } catch {
    features = {};
  }
  await prisma.plan.create({
    data: {
      key: parsed.data.key,
      nameFa: parsed.data.nameFa,
      priceMonthlyToman: Number(parsed.data.priceMonthlyToman),
      maxChildren: Number(parsed.data.maxChildren),
      quotasJson: quotas,
      featuresJson: features,
      isActive: true
    }
  });

  const session = await getServerAuthSession();
  if (session?.user?.id) {
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: "plan.create",
        metadata: { key: parsed.data.key, nameFa: parsed.data.nameFa }
      }
    });
  }
}

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr]">
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>پلن‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کلید</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>ماهانه (تومان)</TableHead>
                <TableHead>حداکثر کودک</TableHead>
                <TableHead>فعال</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.key}</TableCell>
                  <TableCell>{plan.nameFa}</TableCell>
                  <TableCell>{plan.priceMonthlyToman.toLocaleString()}</TableCell>
                  <TableCell>{plan.maxChildren}</TableCell>
                  <TableCell>{plan.isActive ? "بله" : "خیر"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>افزودن پلن</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPlan} className="space-y-3">
            <div className="space-y-2">
              <Label>کلید</Label>
              <Input name="key" required />
            </div>
            <div className="space-y-2">
              <Label>نام فارسی</Label>
              <Input name="nameFa" required />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>قیمت ماهانه (تومان)</Label>
                <Input name="priceMonthlyToman" required />
              </div>
              <div className="space-y-2">
                <Label>حداکثر کودک</Label>
                <Input name="maxChildren" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Quotas JSON</Label>
              <Textarea name="quotasJson" defaultValue="{}" />
            </div>
            <div className="space-y-2">
              <Label>Features JSON</Label>
              <Textarea name="featuresJson" defaultValue="{}" />
            </div>
            <Button className="w-full" type="submit">ثبت</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
