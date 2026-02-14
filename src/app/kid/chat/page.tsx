import { redirect } from "next/navigation";
import { getActiveChild } from "@/lib/device-session";
import { ChildChat } from "@/components/child-chat";
import { prisma } from "@/lib/db";

export default async function KidChatPage() {
  const child = await getActiveChild();
  if (!child) redirect("/profiles");
  const subscription = await prisma.subscription.findFirst({
    where: { parentId: child.parentId, status: "ACTIVE" },
    include: { plan: true }
  });
  if (!subscription) {
    redirect("/profiles");
  }
  const features = (subscription?.plan?.featuresJson as any) ?? {};

  return (
    <div className="h-full flex flex-col">
      <div className="md:container md:py-8 h-full flex-1">
        <ChildChat
          child={{
            id: child.id,
            nickname: child.nickname,
            ageGroup: child.ageGroup,
            avatarKey: child.avatarKey
          }}
          features={{
            smartStory: Boolean(features.smartStory),
            priority: Boolean(features.priority)
          }}
        />
      </div>
    </div>
  );
}
