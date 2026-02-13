import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ParentSidebar } from "@/components/layout/parent-sidebar";
import { SiteHeader } from "@/components/site-header"; // I should check if SiteHeader is suitable or needs adaptation

export default async function ParentLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const session = await getServerAuthSession();
    if (!session?.user?.id) redirect("/login");

    const parent = await prisma.parentProfile.findFirst({
        where: { userId: session.user.id }
    });

    if (!parent) redirect("/profiles/new"); // Or onboarding

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <ParentSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <SiteHeader className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md" />
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
