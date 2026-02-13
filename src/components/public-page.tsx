import { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PublicPage({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="mb-8 text-center text-3xl font-bold text-slate-800">{title}</h1>
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
