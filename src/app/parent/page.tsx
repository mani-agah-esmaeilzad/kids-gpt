import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getActiveSubscription } from "@/lib/quotas";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BarChart2, Users, CreditCard, ArrowLeft } from "lucide-react";
import { getAvatarSrc } from "@/lib/avatars";

export default async function ParentDashboard() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/login");

  const parent = await prisma.parentProfile.findFirst({
    where: { userId: session.user.id },
    include: { children: true }
  });

  if (!parent) redirect("/profiles/new");

  const subscription = await getActiveSubscription(parent.id);
  const planName = subscription?.plan?.name ?? "رایگان";
  const childCount = parent.children.length;
  const activeChildren = parent.children.filter(c => c.isActive).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">داشبورد والدین</h1>
        <p className="text-slate-500">خلاصه فعالیت‌ها و وضعیت اشتراک شما</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Children Stat */}
        <Card className="shadow-soft border-0 bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">کودکان فعال</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeChildren} از {childCount}</div>
            <p className="text-xs text-muted-foreground mt-1">پروفایل تعریف شده</p>
          </CardContent>
        </Card>

        {/* Subscription Stat */}
        <Card className="shadow-soft border-0 bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">اشتراک فعلی</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{planName}</div>
            <p className="text-xs text-muted-foreground mt-1">تپلن شما فعال است</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions / Children List */}
        <Card className="col-span-4 shadow-soft">
          <CardHeader>
            <CardTitle>مدیریت کودکان</CardTitle>
            <CardDescription>برای مدیریت یا مشاهده گزارش روی کودک کلیک کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parent.children.map((child) => (
                <div key={child.id} className="flex items-center justify-between p-4 rounded-xl border bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded-xl bg-white shadow-sm overflow-hidden border border-slate-100">
                      <Image
                        src={getAvatarSrc(child.avatarKey)}
                        alt={child.nickname}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{child.nickname}</p>
                      <p className="text-xs text-muted-foreground">{child.isActive ? "فعال" : "غیرفعال"}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/parent/reports?childId=${child.id}`}>
                      گزارش <ArrowLeft className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed" asChild>
                <Link href="/profiles/new">
                  <Plus className="w-4 h-4 mr-2" />
                  افزودن کودک جدید
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity (Mock) */}
        <Card className="col-span-3 shadow-soft">
          <CardHeader>
            <CardTitle>فعالیت‌های اخیر</CardTitle>
            <CardDescription>خلاصه استفاده کودکان در ۲۴ ساعت گذشته</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-sm text-slate-600">علی ۳۰ دقیقه با هوش مصنوعی گفتگو کرد.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="text-sm text-slate-600">سارا نشان "کنجکاو" را دریافت کرد! 🏆</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <p className="text-sm text-slate-600">علی در مورد "دایناسورها" سوال کرد.</p>
              </div>
            </div>
            <div className="mt-8">
              <Button variant="link" className="px-0 text-primary" asChild>
                <Link href="/parent/reports">مشاهده گزارش کامل</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
