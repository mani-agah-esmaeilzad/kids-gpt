"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ParentDataActions() {
  const [loading, setLoading] = useState(false);

  const download = () => {
    window.location.href = "/api/parent/export";
  };

  const remove = async () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید داده‌ها حذف شود؟")) return;
    setLoading(true);
    await fetch("/api/parent/delete", { method: "DELETE" });
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" onClick={download}>
        دانلود گزارش
      </Button>
      <Button variant="destructive" onClick={remove} disabled={loading}>
        حذف کامل داده‌ها
      </Button>
    </div>
  );
}
