import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import Link from "next/link";
import { PublicPage } from "@/components/public-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2)
});

async function createParent(formData: FormData) {
  "use server";
  const data = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    displayName: String(formData.get("displayName") ?? "")
  };
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error("اطلاعات نامعتبر است.");
  }
  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });
  if (existing) {
    throw new Error("این ایمیل قبلاً ثبت شده است.");
  }
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      role: "PARENT",
      parentProfile: {
        create: {
          displayName: parsed.data.displayName
        }
      }
    },
    include: { parentProfile: true }
  });
  redirect("/login?registered=1");
}

export default function SignupPage() {
  return (
    <PublicPage title="ساخت حساب والدین">
      <div className="mx-auto max-w-md">
        <Card className="border-0 bg-white/90 shadow-soft">
          <CardHeader>
            <CardTitle>ساخت حساب والدین</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createParent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">نام نمایشی</Label>
                <Input id="displayName" name="displayName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button className="w-full" type="submit">
                ساخت حساب
              </Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">
              قبلا ثبت‌نام کرده‌اید؟{" "}
              <Link href="/login" className="text-primary">
                ورود
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicPage>
  );
}
