"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { getActiveSubscription, type PlanLimits } from "@/lib/quotas";
import { revalidatePath } from "next/cache";

const schema = z.object({
    nickname: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
    ageGroup: z.enum(["AGE_6_8", "AGE_9_12", "AGE_13_15"]),
    avatarKey: z.string().min(1, "انتخاب آواتار الزامی است")
});

export async function createProfile(formData: FormData) {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const data = {
        nickname: String(formData.get("nickname") ?? ""),
        ageGroup: String(formData.get("ageGroup") ?? ""),
        avatarKey: String(formData.get("avatarKey") ?? "")
    };

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
        throw new Error(parsed.error.errors[0].message);
    }

    const parent = await prisma.parentProfile.findFirst({
        where: { userId: session.user.id },
        include: { children: true }
    });

    if (!parent) throw new Error("Parent not found");

    const subscription = await getActiveSubscription(parent.id);
    if (!subscription) {
        throw new Error("پلن فعال ندارید.");
    }

    const limits = (subscription?.plan?.limits ?? {}) as PlanLimits;
    if (limits.childrenLimit && parent.children.length >= limits.childrenLimit) {
        throw new Error("سقف تعداد پروفایل این پلن پر شده است.");
    }

    await prisma.childProfile.create({
        data: {
            parentId: parent.id,
            nickname: parsed.data.nickname,
            ageGroup: parsed.data.ageGroup,
            avatarKey: parsed.data.avatarKey,
            settings: {}
        }
    });

    revalidatePath("/profiles");
    revalidatePath("/profiles/manage");
    redirect("/profiles");
}

export async function updateProfile(childId: string, formData: FormData) {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const data = {
        nickname: String(formData.get("nickname") ?? ""),
        ageGroup: String(formData.get("ageGroup") ?? ""),
        avatarKey: String(formData.get("avatarKey") ?? "")
    };

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
        throw new Error(parsed.error.errors[0].message);
    }

    const parent = await prisma.parentProfile.findFirst({
        where: { userId: session.user.id }
    });

    const child = await prisma.childProfile.findUnique({ where: { id: childId } });

    if (!parent || !child || child.parentId !== parent.id) {
        throw new Error("Access denied");
    }

    await prisma.childProfile.update({
        where: { id: childId },
        data: {
            nickname: parsed.data.nickname,
            ageGroup: parsed.data.ageGroup,
            avatarKey: parsed.data.avatarKey
        }
    });

    revalidatePath("/profiles/manage");
    redirect("/profiles/manage");
}
