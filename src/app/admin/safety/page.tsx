import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminSafetyPage() {
  const incidents = await prisma.safetyIncident.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { child: true }
  });

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle>صف ایمنی</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {incidents.map((incident) => (
          <div key={incident.id} className="rounded-2xl bg-muted/40 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{incident.type}</p>
              <Badge variant={incident.action === "ESCALATE" ? "warning" : "destructive"}>
                {incident.action}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              کودک: {incident.child.nickname} | {incident.contentExcerpt}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
