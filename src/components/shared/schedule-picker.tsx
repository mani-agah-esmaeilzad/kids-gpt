"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SchedulePickerProps {
    startTime: string;
    endTime: string;
    onStartChange: (time: string) => void;
    onEndChange: (time: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
});

export function SchedulePicker({ startTime, endTime, onStartChange, onEndChange }: SchedulePickerProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="grid gap-2">
                <Label>از ساعت</Label>
                <Select value={startTime} onValueChange={onStartChange}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="شروع" />
                    </SelectTrigger>
                    <SelectContent>
                        {HOURS.map((t) => (
                            <SelectItem key={`start-${t}`} value={t}>{t}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label>تا ساعت</Label>
                <Select value={endTime} onValueChange={onEndChange}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="پایان" />
                    </SelectTrigger>
                    <SelectContent>
                        {HOURS.map((t) => (
                            <SelectItem key={`end-${t}`} value={t}>{t}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
