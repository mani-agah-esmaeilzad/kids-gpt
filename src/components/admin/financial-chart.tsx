"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

type Point = {
  label: string;
  revenue: number;
  cost: number;
};

export function FinancialChart({ data }: { data: Point[] }) {
  return (
    <div className="h-[300px] w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ direction: "rtl" }} />
          <Legend />
          <Line type="monotone" dataKey="revenue" name="درآمد" stroke="#22c55e" strokeWidth={3} />
          <Line type="monotone" dataKey="cost" name="هزینه" stroke="#ef4444" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
