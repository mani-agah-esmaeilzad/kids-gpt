"use client";

import { useEffect, useState } from "react";
import { Command } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const commands = [
  { label: "نمای کلی", href: "/admin" },
  { label: "کاربران", href: "/admin/users" },
  { label: "پلن‌ها", href: "/admin/plans" },
  { label: "ایمنی", href: "/admin/safety" },
  { label: "تنظیمات", href: "/admin/config" }
];

export function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = commands.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <button
        className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Command className="h-4 w-4" />
        جستجوی سریع
        <span className="rounded-full bg-background px-2 py-1 text-[10px]">Ctrl K</span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card text-foreground">
          <Input
            autoFocus
            placeholder="جستجو..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="mt-4 space-y-2">
            {filtered.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block rounded-2xl bg-muted px-4 py-3 text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
