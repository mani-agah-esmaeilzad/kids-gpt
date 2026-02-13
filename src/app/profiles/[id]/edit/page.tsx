import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { EditProfileWrapper } from "./wrapper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function EditProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/login");

  const parent = await prisma.parentProfile.findFirst({ where: { userId: session.user.id } });
  const child = await prisma.childProfile.findUnique({ where: { id: params.id } });
  if (!parent || !child || child.parentId !== parent.id) redirect("/profiles/manage");

  return (
    <div className="gradient-sky min-h-screen py-12">
      <div className="container max-w-lg">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/profiles/manage">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">ویرایش پروفایل</h1>
        </div>
        <EditProfileWrapper
          childId={child.id}
          initialData={{
            nickname: child.nickname,
            ageGroup: child.ageGroup,
            avatarKey: child.avatarKey
          }}
        />
      </div>
    </div>
  );
}
