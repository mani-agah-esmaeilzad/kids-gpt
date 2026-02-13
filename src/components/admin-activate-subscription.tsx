"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminActivateSubscription({ subscriptionId }: { subscriptionId: string }) {
  const [loading, setLoading] = useState(false);

  const activate = async () => {
    setLoading(true);
    await fetch("/api/admin/subscriptions/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId, reference: "manual" })
    });
    setLoading(false);
  };

  return (
    <Button size="sm" onClick={activate} disabled={loading}>
      {loading ? "در حال فعال‌سازی" : "فعال‌سازی دستی"}
    </Button>
  );
}
