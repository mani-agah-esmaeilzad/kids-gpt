import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminExportsPage() {
  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle>خروجی CSV</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">فایل‌های خروجی برای تحلیل مالی و ایمنی.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/api/admin/exports/usage">دانلود مصرف</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/api/admin/exports/logs">دانلود لاگ سیستم</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
