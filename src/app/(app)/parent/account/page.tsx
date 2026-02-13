import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default async function ParentAccountPage() {
    const session = await getServerAuthSession();
    if (!session?.user?.id) redirect("/login");

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">تنظیمات حساب کاربری</h1>
                <p className="text-slate-500">مدیریت اطلاعات شخصی و امنیتی</p>
            </div>

            <Card className="shadow-soft border-0">
                <CardHeader>
                    <CardTitle>اطلاعات پایه</CardTitle>
                    <CardDescription>اطلاعات تماس شما نزد ما محفوظ است.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>ایمیل / نام کاربری</Label>
                        <Input defaultValue={session.user.email ?? ""} disabled />
                        <p className="text-xs text-muted-foreground">این شناسه کاربری شماست و قابل تغییر نیست.</p>
                    </div>
                    <div className="grid gap-2">
                        <Label>نام نمایشی</Label>
                        <Input placeholder="نام شما" name="name" />
                    </div>
                    <Button>ذخیره تغییرات</Button>
                </CardContent>
            </Card>

            <Card className="shadow-soft border-0">
                <CardHeader>
                    <CardTitle className="text-red-600">منطقه خطر</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900">حذف حساب کاربری</p>
                            <p className="text-sm text-slate-500">تمام داده‌ها و پروفایل‌های کودکان حذف خواهند شد.</p>
                        </div>
                        <Button variant="destructive">حذف حساب</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
