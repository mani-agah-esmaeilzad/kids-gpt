import { NextResponse } from "next/server";
import { getActiveChild } from "@/lib/device-session";
import { cookies } from "next/headers";

export async function GET() {
  const kidCookie = cookies().get("gptkids_kid")?.value;
  if (!kidCookie) {
    return NextResponse.json({ child: null }, { status: 401 });
  }
  const child = await getActiveChild();
  if (!child) {
    return NextResponse.json({ child: null }, { status: 404 });
  }
  return NextResponse.json({
    child: {
      id: child.id,
      nickname: child.nickname,
      ageGroup: child.ageGroup,
      avatarKey: child.avatarKey
    }
  });
}
