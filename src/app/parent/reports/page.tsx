import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
// import { UsageChart } from "@/components/usage-chart"; // Assuming this exists or I'll genericize it

export default async function ParentReportsPage() {
    const session = await getServerAuthSession();
    if (!session?.user?.id) redirect("/login");

    const parent = await prisma.parentProfile.findFirst({
        where: { userId: session.user.id },
        include: { children: true }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">گزارش فعالیت‌ها</h1>
                <p className="text-slate-500">مشاهده میزان یادگیری و سرگرمی کودکان</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Placeholder for specific child report selection or aggregate */}
                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle>نمودار مصرف هفته</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground bg-slate-50/50 rounded-xl m-4">
                        {/* <UsageChart /> */}
                        <p>نمودار فعالیت (به زودی)</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
