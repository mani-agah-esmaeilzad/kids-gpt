import { getServerAuthSession } from "@/lib/auth";
import { ParentSidebar } from "@/components/layout/parent-sidebar";
import { SignOutButton } from "@/components/signout-button";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <div className="gradient-sky min-h-screen">
      <div className="container flex gap-6 py-8">
        <ParentSidebar />
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between rounded-3xl bg-white/90 px-6 py-4 shadow-soft">
            <div>
              <p className="text-xs text-muted-foreground">خوش آمدید</p>
              <p className="text-lg font-semibold">{session?.user?.email ?? "والدین"}</p>
            </div>
            <SignOutButton />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
