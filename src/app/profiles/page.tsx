import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/quotas";
import { ProfilePicker } from "@/components/profiles/profile-picker";

export default async function ProfilesPage() {
  const session = await getServerAuthSession();
  let parentId: string | null = null;
  let profiles: any[] = [];
  let hasActivePlan = false;
  let isParentLoggedIn = Boolean(session?.user?.id);

  if (session?.user?.id) {
    const parent = await prisma.parentProfile.findFirst({
      where: { userId: session.user.id },
      include: { children: true }
    });
    parentId = parent?.id ?? null;
    profiles = parent?.children ?? [];
  } else {
    const deviceId = cookies().get("gptkids_device")?.value;
    if (deviceId) {
      const deviceSession = await prisma.kidDeviceSession.findUnique({
        where: { deviceId }
      });
      if (deviceSession?.activeChildId) {
        const child = await prisma.childProfile.findUnique({
          where: { id: deviceSession.activeChildId }
        });
        parentId = child?.parentId ?? null;
        if (parentId) {
          const parent = await prisma.parentProfile.findUnique({
            where: { id: parentId },
            include: { children: true }
          });
          profiles = parent?.children ?? [];
        }
      }
    }
  }

  if (parentId) {
    const subscription = await getActiveSubscription(parentId);
    hasActivePlan = Boolean(subscription);
  }

  if (!parentId) {
    return (
      <div className="gradient-sky min-h-screen">
        <div className="container py-20">
          <div className="mx-auto max-w-lg rounded-3xl bg-white/80 p-10 text-center shadow-soft">
            <h1 className="text-2xl font-bold">ابتدا وارد شوید</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              برای ساخت یا انتخاب پروفایل کودک، والد باید وارد حساب خود شود.
            </p>
            <a
              href="/login"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              ورود والدین
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-sky min-h-screen flex items-center justify-center">
      <div className="container py-16">
        <ProfilePicker
          profiles={profiles.map((child) => ({
            id: child.id,
            nickname: child.nickname,
            ageGroup: child.ageGroup,
            avatarKey: child.avatarKey,
            isActive: child.isActive
          }))}
          isParentLoggedIn={isParentLoggedIn}
          hasActivePlan={hasActivePlan}
        />
      </div>
    </div>
  );
}
