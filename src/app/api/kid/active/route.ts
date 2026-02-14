import { NextResponse } from "next/server";
import { getActiveChild } from "@/lib/device-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const kidCookie = cookies().get("gptkids_kid")?.value;
  if (!kidCookie) {
    return NextResponse.json({ child: null }, { status: 401 });
  }
  const child = await getActiveChild();
  if (!child) {
    return NextResponse.json({ child: null }, { status: 404 });
  }
  const subscription = await prisma.subscription.findFirst({
    where: { parentId: child.parentId, status: "ACTIVE" },
    include: { plan: true }
  });
  return NextResponse.json({
    child: {
      id: child.id,
      nickname: child.nickname,
      ageGroup: child.ageGroup,
      avatarKey: child.avatarKey
    },
    plan: subscription?.plan
      ? {
          key: subscription.plan.key,
          nameFa: subscription.plan.nameFa,
          features: subscription.plan.featuresJson,
          quotas: subscription.plan.quotasJson
        }
      : null
  });
}
