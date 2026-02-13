"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sparkles, HelpCircle, Puzzle, BookOpen } from "lucide-react";

interface SuggestionChipsProps {
    suggestions?: { label: string; icon?: React.ReactNode; value: string }[];
    onSelect: (value: string) => void;
    className?: string;
}

const DEFAULT_SUGGESTIONS = [
    { label: "یه داستان بگو", value: "یه داستان بامزه و آموزنده برام تعریف کن", icon: <BookOpen className="w-4 h-4 text-kid-blue" /> },
    { label: "یه معما بگو", value: "یه معمای جالب بپرس که بتونم حدس بزنم", icon: <Puzzle className="w-4 h-4 text-kid-purple" /> },
    { label: "کمکم کن تکلیفمو بفهمم", value: "می‌خوام درباره درسم سوال بپرسم، کمکم می‌کنی؟", icon: <HelpCircle className="w-4 h-4 text-kid-orange" /> },
    { label: "یه آزمایش علمی", value: "یه آزمایش علمی ساده و بی‌خطر که تو خونه انجام بدم بهم یاد بده", icon: <Sparkles className="w-4 h-4 text-kid-green" /> },
];

export function SuggestionChips({ suggestions = DEFAULT_SUGGESTIONS, onSelect, className }: SuggestionChipsProps) {
    return (
        <ScrollArea className={cn("w-full whitespace-nowrap", className)}>
            <div className="flex w-max space-x-2 space-x-reverse p-1">
                {suggestions.map((suggestion) => (
                    <Button
                        key={suggestion.value}
                        variant="outline"
                        className="rounded-full border-2 border-primary/10 bg-white hover:bg-primary/5 hover:border-primary/30 h-10 px-4 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5"
                        onClick={() => onSelect(suggestion.value)}
                    >
                        {suggestion.icon && <span className="ml-2">{suggestion.icon}</span>}
                        {suggestion.label}
                    </Button>
                ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
    );
}
