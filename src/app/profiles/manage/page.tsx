import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAvatarSrc } from "@/lib/avatars";
import { Edit, Shield, Power, Plus, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header"; // Assuming we want a header

async function toggleActive(formData: FormData) {
  "use server";
  const childId = String(formData.get("childId") ?? "");
  const session = await getServerAuthSession();
  if (!session?.user?.id) return;
  const child = await prisma.childProfile.findUnique({ where: { id: childId } });
  if (!child) return;
  const parent = await prisma.parentProfile.findFirst({ where: { userId: session.user.id } });
  if (!parent || child.parentId !== parent.id) return;
  await prisma.childProfile.update({
    where: { id: childId },
    data: { isActive: !child.isActive }
  });
  redirect("/profiles/manage"); // Refresh page
}

export default async function ManageProfilesPage() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/login");

  const parent = await prisma.parentProfile.findFirst({
    where: { userId: session.user.id },
    include: { children: true }
  });

  const ageLabel = (value: string) => {
    switch (value) {
      case "AGE_6_8": return "۶ تا ۸ سال";
      case "AGE_9_12": return "۹ تا ۱۲ سال";
      case "AGE_13_15": return "۱۳ تا ۱۵ سال";
      default: return "نامشخص";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="container py-12 max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Link href="/parent" className="hover:text-primary">داشبورد</Link>
              <span>/</span>
              <span>پروفایل‌ها</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">مدیریت پروفایل‌ها</h1>
            <p className="text-slate-500 mt-1">پروفایل‌های کودکان را ویرایش، غیرفعال یا اضافه کنید.</p>
          </div>
          <Button asChild size="lg" className="shadow-sm">
            <Link href="/profiles/new">
              <Plus className="mr-2 h-5 w-5" />
              افزودن پروفایل جدید
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {parent?.children.map((child) => (
            <Card key={child.id} className={`overflow-hidden transition-all hover:shadow-md ${!child.isActive ? 'opacity-70 grayscale' : ''}`}>
              <CardHeader className="flex flex-row items-center gap-4 bg-white border-b p-6">
                <div className="relative h-16 w-16 rounded-2xl bg-white shadow-sm border border-blue-100 overflow-hidden">
                  <Image
                    src={getAvatarSrc(child.avatarKey)}
                    alt={child.nickname}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{child.nickname}</CardTitle>
                    <Badge variant={child.isActive ? "default" : "secondary"}>
                      {child.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-slate-300"></span>
                    {ageLabel(child.ageGroup)}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-slate-50/50">
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" className="h-10 bg-white hover:bg-slate-50 border-slate-200">
                    <Link href={`/profiles/${child.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2 text-slate-500" />
                      ویرایش
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-10 bg-white hover:bg-slate-50 border-slate-200">
                    <Link href={`/parent/settings?childId=${child.id}`}>
                      <Shield className="w-4 h-4 mr-2 text-green-600" />
                      ایمنی
                    </Link>
                  </Button>
                  <form action={toggleActive} className="col-span-2">
                    <input type="hidden" name="childId" value={child.id} />
                    <Button
                      variant="ghost"
                      className={`w-full justify-start h-10 ${child.isActive ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                      type="submit"
                    >
                      <Power className="w-4 h-4 mr-2" />
                      {child.isActive ? "غیرفعال کردن پروفایل" : "فعال‌سازی مجدد پروفایل"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State / Add New Card */}
          <Link href="/profiles/new" className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-all hover:bg-white hover:border-primary/50 hover:shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-900/5 group-hover:scale-110 transition-transform">
              <Plus className="h-8 w-8 text-slate-400 group-hover:text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-slate-900 group-hover:text-primary">ساخت پروفایل جدید</h3>
              <p className="text-sm text-slate-500">برای فرزند دیگرتان یک محیط امن بسازید</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
