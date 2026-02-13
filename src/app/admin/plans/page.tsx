import { z } from "zod";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  priceMonthly: z.string(),
  priceYearly: z.string(),
  limits: z.string(),
  features: z.string()
});

async function createPlan(formData: FormData) {
  "use server";
  const data = {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    priceMonthly: String(formData.get("priceMonthly") ?? "0"),
    priceYearly: String(formData.get("priceYearly") ?? "0"),
    limits: String(formData.get("limits") ?? "{}"),
    features: String(formData.get("features") ?? "{}")
  };
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");
  let limits = {};
  let features = {};
  try {
    limits = JSON.parse(parsed.data.limits);
  } catch {
    limits = {};
  }
  try {
    features = JSON.parse(parsed.data.features);
  } catch {
    features = {};
  }
  await prisma.plan.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      priceMonthly: Number(parsed.data.priceMonthly),
      priceYearly: Number(parsed.data.priceYearly),
      limits,
      features,
      isActive: true
    }
  });
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
                <TableHead>نام</TableHead>
                <TableHead>ماهانه</TableHead>
                <TableHead>سالانه</TableHead>
                <TableHead>فعال</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.priceMonthly}</TableCell>
                  <TableCell>{plan.priceYearly}</TableCell>
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
              <Label>نام</Label>
              <Input name="name" required />
            </div>
            <div className="space-y-2">
              <Label>توضیح</Label>
              <Input name="description" required />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>قیمت ماهانه</Label>
                <Input name="priceMonthly" required />
              </div>
              <div className="space-y-2">
                <Label>قیمت سالانه</Label>
                <Input name="priceYearly" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Limits JSON</Label>
              <Textarea name="limits" defaultValue="{}" />
            </div>
            <div className="space-y-2">
              <Label>Features JSON</Label>
              <Textarea name="features" defaultValue="{}" />
            </div>
            <Button className="w-full" type="submit">ثبت</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
