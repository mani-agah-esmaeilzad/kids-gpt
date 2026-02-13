import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ParentDataActions } from "@/components/parent-data-actions";

const schema = z.object({
  allowedStart: z.string().min(1),
  allowedEnd: z.string().min(1),
  whitelist: z.string().optional(),
  blacklist: z.string().optional(),
  childId: z.string().min(1)
});

async function updateSettings(formData: FormData) {
  "use server";
  const session = await getServerAuthSession();
  const data = {
    allowedStart: String(formData.get("allowedStart") ?? ""),
    allowedEnd: String(formData.get("allowedEnd") ?? ""),
    whitelist: String(formData.get("whitelist") ?? ""),
    blacklist: String(formData.get("blacklist") ?? ""),
    childId: String(formData.get("childId") ?? "")
  };
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new Error("اطلاعات نامعتبر");
  const child = await prisma.childProfile.findFirst({
    where: { id: parsed.data.childId, parent: { userId: session?.user?.id } }
  });
  if (!child) return;
  await prisma.childProfile.update({
    where: { id: child.id },
    data: {
      settings: {
        allowedHours: {
          start: parsed.data.allowedStart,
          end: parsed.data.allowedEnd
        },
        topicWhitelist: parsed.data.whitelist
          ? parsed.data.whitelist.split(",").map((s) => s.trim())
          : [],
        topicBlacklist: parsed.data.blacklist
          ? parsed.data.blacklist.split(",").map((s) => s.trim())
          : []
      }
    }
  });
}

export default async function SettingsPage({
  searchParams
}: {
  searchParams?: { childId?: string };
}) {
  const session = await getServerAuthSession();
  const parent = await prisma.parentProfile.findFirst({
    where: { userId: session?.user?.id },
    include: { children: true }
  });
  const child =
    parent?.children?.find((c) => c.id === searchParams?.childId) ??
    parent?.children?.[0];
  const settings = (child?.settings as any) ?? {};

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-0 bg-white/90 shadow-soft">
        <CardHeader>
          <CardTitle>تنظیمات ایمنی کودک</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            {parent?.children.map((item) => (
              <a
                key={item.id}
                href={`/parent/settings?childId=${item.id}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.id === child?.id ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {item.nickname}
              </a>
            ))}
          </div>
          <form action={updateSettings} className="space-y-4">
            <input type="hidden" name="childId" value={child?.id ?? ""} />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>شروع ساعت مجاز</Label>
                <Input
                  name="allowedStart"
                  defaultValue={settings?.allowedHours?.start ?? "08:00"}
                />
              </div>
              <div className="space-y-2">
                <Label>پایان ساعت مجاز</Label>
                <Input
                  name="allowedEnd"
                  defaultValue={settings?.allowedHours?.end ?? "20:00"}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>لیست سفید موضوعات (با کاما جدا کنید)</Label>
              <Textarea
                name="whitelist"
                defaultValue={(settings?.topicWhitelist ?? []).join(", ")}
              />
            </div>
            <div className="space-y-2">
              <Label>لیست سیاه موضوعات</Label>
              <Textarea
                name="blacklist"
                defaultValue={(settings?.topicBlacklist ?? []).join(", ")}
              />
            </div>
            <Button type="submit" className="w-full">ذخیره</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="border-0 bg-white/90 shadow-soft">
        <CardHeader>
          <CardTitle>کنترل داده‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>می‌توانید داده‌ها را دانلود یا حذف کنید. حذف داده‌ها غیرقابل بازگشت است.</p>
          <ParentDataActions />
        </CardContent>
      </Card>
    </div>
  );
}
