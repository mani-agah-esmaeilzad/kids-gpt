import { prisma } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminActivateSubscription } from "@/components/admin-activate-subscription";
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: { q?: string; page?: string }
}) {
  const query = searchParams.q ?? "";
  const page = Number(searchParams.page ?? 1);
  const pageSize = 10;

  const where = query ? {
    OR: [
      { user: { email: { contains: query } } },
      { displayName: { contains: query } }
    ]
  } : {};

  const [parents, total] = await Promise.all([
    prisma.parentProfile.findMany({
      where,
      include: { user: true, children: true, subscriptions: { include: { plan: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    }),
    prisma.parentProfile.count({ where })
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">مدیریت کاربران</h1>
          <p className="text-muted-foreground">لیست والدین و وضعیت اشتراک‌ها</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            فیلترها
          </Button>
          <Button size="sm">
            افزودن کاربر جدید
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <form>
                <Input
                  name="q"
                  placeholder="جستجو بر اساس ایمیل یا نام..."
                  className="pr-9"
                  defaultValue={query}
                />
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>کاربر</TableHead>
                <TableHead>وضعیت اشتراک</TableHead>
                <TableHead>کودکان</TableHead>
                <TableHead>تاریخ عضویت</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    هیچ کاربری یافت نشد.
                  </TableCell>
                </TableRow>
              ) : (
                parents.map((parent) => (
                  <TableRow key={parent.id} className="hover:bg-muted/5">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{parent.displayName || "بدون نام"}</span>
                        <span className="text-xs text-muted-foreground">{parent.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {parent.subscriptions[0] ? (
                          <Badge variant={parent.subscriptions[0].status === "ACTIVE" ? "success" : "secondary"}>
                            {parent.subscriptions[0].plan?.name ?? "نامشخص"}
                          </Badge>
                        ) : (
                          <Badge variant="outline">رایگان</Badge>
                        )}
                        {/* <AdminActivateSubscription subscriptionId={parent.subscriptions[0]?.id} /> */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                        {parent.children.map(child => (
                          <div key={child.id} className="inline-flex h-6 w-6 items-center justify-center rounded-full border bg-background text-[10px] font-bold ring-2 ring-background">
                            {child.nickname[0]}
                          </div>
                        ))}
                        {parent.children.length === 0 && <span className="text-xs text-muted-foreground">-</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(parent.createdAt).toLocaleDateString('fa-IR')}
                    </TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>مشاهده جزئیات</DropdownMenuItem>
                          <DropdownMenuItem>ویرایش اشتراک</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">مسدود کردن</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t">
          <div className="flex-1 text-sm text-muted-foreground">
            نمایش {parents.length} از {total} کاربر
          </div>
          <div className="space-x-2 flex items-center">
            <Button variant="outline" size="sm" disabled={page <= 1}>
              <ChevronRight className="h-4 w-4" />
              قبلی
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages}>
              بعدی
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
