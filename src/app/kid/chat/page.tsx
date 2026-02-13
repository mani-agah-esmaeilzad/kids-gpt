import { redirect } from "next/navigation";
import { getActiveChild } from "@/lib/device-session";
import { ChildChat } from "@/components/child-chat";

export default async function KidChatPage() {
  const child = await getActiveChild();
  if (!child) redirect("/profiles");

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
        />
      </div>
    </div>
  );
}
