"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export type UsagePoint = {
  label: string;
  messages: number;
  tokens: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="bg-white/95 shadow-lg border-none text-xs">
        <CardContent className="p-2">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-primary">پیام‌ها: {payload[0].value}</p>
          {/* <p className="text-sky-500">توکن‌ها: {payload[1].value}</p> */}
        </CardContent>
      </Card>
    );
  }
  return null;
};

export function UsageChart({ data }: { data: UsagePoint[] }) {
  return (
    <div className="h-[300px] w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="label"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="messages"
            name="تعداد پیام‌ها"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          {/* <Line type="monotone" dataKey="tokens" stroke="#38bdf8" strokeWidth={2} /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
