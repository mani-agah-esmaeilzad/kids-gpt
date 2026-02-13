import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { MascotHeader } from "@/components/layout/mascot-header"; // I will create this if not exists
import { KidNav } from "@/components/layout/kid-nav"; // Navigation for kids

async function getActiveChild() {
    const cookieStore = cookies();
    const deviceId = cookieStore.get("gptkids_device")?.value;
    if (!deviceId) return null;

    const session = await prisma.kidDeviceSession.findUnique({
        where: { deviceId }
    });

    if (!session?.activeChildId) return null;

    return prisma.childProfile.findUnique({
        where: { id: session.activeChildId }
    });
}

export default async function KidLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const child = await getActiveChild();

    if (!child) {
        redirect("/profiles");
    }

    return (
        <div className="min-h-screen bg-kid-bg font-sans selection:bg-kid-yellow/50">
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-kid-blue/20 rounded-full blur-3xl animate-blob opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-kid-pink/20 rounded-full blur-3xl animate-blob animation-delay-2000 opacity-60"></div>
                <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-kid-yellow/20 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-40"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="px-4 py-4 md:px-8">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <MascotHeader childName={child.nickname} avatarKey={child.avatarKey} />
                        <KidNav />
                    </div>
                </header>

                <main className="flex-1 w-full max-w-6xl mx-auto md:px-8 md:py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
