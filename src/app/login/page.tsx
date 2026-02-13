import Link from "next/link";
import { PublicPage } from "@/components/public-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <PublicPage title="ورود والدین">
      <div className="mx-auto max-w-md">
        <Card className="border-0 bg-white/90 shadow-soft">
          <CardHeader>
            <CardTitle>ورود به داشبورد والدین</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm />
            <p className="text-sm text-muted-foreground">
              حساب ندارید؟{" "}
              <Link href="/signup" className="text-primary">
                ساخت حساب
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicPage>
  );
}
