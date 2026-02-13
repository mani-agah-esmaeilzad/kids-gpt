import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getActiveSubscription } from "@/lib/quotas";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";
// import { PricingCards } from "@/components/pricing-cards"; // Reuse if possible

export default async function ParentBillingPage() {
    const session = await getServerAuthSession();
    if (!session?.user?.id) redirect("/login");

    const parent = await prisma.parentProfile.findFirst({
        where: { userId: session.user.id }
    });
    if (!parent) redirect("/profiles/new");

    const subscription = await getActiveSubscription(parent.id);
    const planName = subscription?.plan?.name ?? "رایگان";
    const isFree = planName === "رایگان";

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">مدیریت اشتراک و صورت‌حساب</h1>
                <p className="text-slate-500">مشاهده وضعیت پلن فعلی و ارتقا سرویس</p>
            </div>

            <Card className="shadow-soft border-l-4 border-l-primary">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">پلن فعلی: {planName}</CardTitle>
                            <CardDescription className="mt-1">
                                {isFree ? "شما از نسخه محدود استفاده می‌کنید." : "شما مشترک ویژه هستید. ممنون از حمایت شما! ❤️"}
                            </CardDescription>
                        </div>
                        {/* Status Badge */}
                        <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                            فعال
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>دسترسی به پروفایل‌های {isFree ? "محدود" : "نامحدود"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>گزارش‌گیری {isFree ? "هفتگی" : "لحظه‌ای و کامل"}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <Button asChild className="bg-primary hover:bg-primary/90">
                            <Link href="/pricing">
                                {isFree ? "ارتقا به نسخه ویژه" : "تغییر پلن"}
                            </Link>
                        </Button>
                        {!isFree && (
                            <Button variant="outline">
                                لغو اشتراک
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Transaction History Placeholder */}
            <Card className="shadow-soft border-0">
                <CardHeader>
                    <CardTitle>تاریخچه پرداخت‌ها</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>هیچ فاکتوری یافت نشد.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
