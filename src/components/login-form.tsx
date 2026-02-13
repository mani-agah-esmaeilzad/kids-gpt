"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    setLoading(false);
    if (result?.error) {
      setError("ایمیل یا رمز عبور نادرست است.");
    } else {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/profiles");
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">ایمیل</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">رمز عبور</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "در حال ورود..." : "ورود"}
      </Button>
    </form>
  );
}
