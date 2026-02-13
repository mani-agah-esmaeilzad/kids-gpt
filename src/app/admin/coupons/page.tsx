import { z } from "zod";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const schema = z.object({
  code: z.string().min(3),
  percentOff: z.string().optional(),
  amountOff: z.string().optional(),
  duration: z.enum(["ONCE", "REPEATING", "FOREVER"])
});

async function createCoupon(formData: FormData) {
  "use server";
  const data = {
    code: String(formData.get("code") ?? "").toUpperCase(),
    percentOff: String(formData.get("percentOff") ?? ""),
    amountOff: String(formData.get("amountOff") ?? ""),
    duration: String(formData.get("duration") ?? "ONCE")
  };
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid coupon");
  await prisma.coupon.create({
    data: {
      code: parsed.data.code,
      percentOff: parsed.data.percentOff ? Number(parsed.data.percentOff) : null,
      amountOff: parsed.data.amountOff ? Number(parsed.data.amountOff) : null,
      duration: parsed.data.duration
    }
  });
}

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr]">
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>کوپن‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کد</TableHead>
                <TableHead>درصد</TableHead>
                <TableHead>مبلغ</TableHead>
                <TableHead>مدت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.percentOff ?? "-"}</TableCell>
                  <TableCell>{coupon.amountOff ?? "-"}</TableCell>
                  <TableCell>{coupon.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>ساخت کوپن</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCoupon} className="space-y-3">
            <div className="space-y-2">
              <Label>کد</Label>
              <Input name="code" required />
            </div>
            <div className="space-y-2">
              <Label>درصد تخفیف</Label>
              <Input name="percentOff" />
            </div>
            <div className="space-y-2">
              <Label>مبلغ تخفیف</Label>
              <Input name="amountOff" />
            </div>
            <div className="space-y-2">
              <Label>مدت</Label>
              <Select name="duration" defaultValue="ONCE">
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONCE">یکبار</SelectItem>
                  <SelectItem value="REPEATING">تکرارشونده</SelectItem>
                  <SelectItem value="FOREVER">همیشگی</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" type="submit">ثبت</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
