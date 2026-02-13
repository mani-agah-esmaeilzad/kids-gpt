import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/quotas";
import { Button } from "@/components/ui/button";
import { NewProfileWrapper } from "./wrapper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function NewProfilePage() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/login");

  const parent = await prisma.parentProfile.findFirst({ where: { userId: session.user.id } });
  if (parent) {
    const subscription = await getActiveSubscription(parent.id);
    if (!subscription) {
      return (
        <div className="gradient-sky min-h-screen flex items-center justify-center">
          <div className="container px-4">
            <div className="mx-auto max-w-lg rounded-3xl bg-white/90 p-8 text-center shadow-soft">
              <h1 className="text-xl font-bold">پلن فعال لازم است</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                برای ساخت پروفایل کودک، ابتدا پلن خود را فعال کنید.
              </p>
              <Button asChild className="mt-4">
                <a href="/pricing">مشاهده پلن‌ها</a>
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="gradient-sky min-h-screen py-12">
      <div className="container max-w-lg">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/profiles/manage">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">ساخت پروفایل جدید</h1>
        </div>
        <NewProfileWrapper />
      </div>
    </div>
  );
}
