import { getServerAuthSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SignOutButton } from "@/components/signout-button";
import { AdminCommandPalette } from "@/components/admin-command";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 shrink-0 border-l bg-white dark:bg-slate-950 h-screen sticky top-0 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
              <span className="font-bold text-xl tracking-tight">پنل مدیریت</span>
            </div>
            <AdminSidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6">
            <div className="flex-1">
              <AdminCommandPalette />
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-sm font-medium">
                {session?.user?.email}
              </div>
              <SignOutButton />
            </div>
          </header>

          <main className="p-6 md:p-8 max-w-[1600px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
