import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";

const DEVICE_COOKIE = "gptkids_device";
const KID_COOKIE = "gptkids_kid";

export async function getOrCreateDeviceId() {
  const store = cookies();
  let deviceId = store.get(DEVICE_COOKIE)?.value;
  if (!deviceId) {
    deviceId = randomUUID();
    store.set(DEVICE_COOKIE, deviceId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });
  }
  return deviceId;
}

export function setKidModeCookie() {
  const store = cookies();
  store.set(KID_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function getKidSession() {
  const deviceId = cookies().get(DEVICE_COOKIE)?.value;
  if (!deviceId) return null;
  return prisma.kidDeviceSession.findUnique({ where: { deviceId } });
}

export async function getActiveChild() {
  const deviceId = cookies().get(DEVICE_COOKIE)?.value;
  if (!deviceId) return null;
  const session = await prisma.kidDeviceSession.findUnique({
    where: { deviceId },
    include: { activeChild: true }
  });
  return session?.activeChild ?? null;
}

export function clearKidModeCookie() {
  cookies().set(KID_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
