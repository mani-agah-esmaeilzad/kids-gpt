"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ChipSelectProps {
    options: { label: string; value: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
    className?: string;
}

export function ChipSelect({ options, selected, onChange, className }: ChipSelectProps) {
    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                    <Badge
                        key={option.value}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                            "cursor-pointer px-3 py-1.5 text-sm transition-all hover:scale-105 active:scale-95",
                            isSelected
                                ? "bg-primary hover:bg-primary/90"
                                : "bg-background hover:bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => toggleOption(option.value)}
                    >
                        {option.label}
                    </Badge>
                );
            })}
        </div>
    );
}
