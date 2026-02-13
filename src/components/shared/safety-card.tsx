"use client";

import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

interface SafetyCardProps {
    title?: string;
    message: string;
    suggestions?: { label: string; action: () => void }[];
    onClose?: () => void;
}

export function SafetyCard({
    title = "بیاییم راجع به چیزای دیگه حرف بزنیم!",
    message,
    suggestions,
    onClose
}: SafetyCardProps) {
    return (
        <div className="relative overflow-hidden rounded-[1.5rem] bg-orange-50 border-2 border-orange-100 p-6 shadow-soft animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 to-yellow-300" />

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500 shadow-sm border border-orange-200">
                        <ShieldAlert className="h-7 w-7" />
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-orange-900">{title}</h3>
                    <p className="text-orange-800 font-medium leading-relaxed">
                        {message}
                    </p>

                    {suggestions && suggestions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="w-full text-sm font-semibold text-orange-700 mb-1">پیشنهاد من:</span>
                            {suggestions.map((suggestion, idx) => (
                                <Button
                                    key={idx}
                                    variant="outline"
                                    size="sm"
                                    onClick={suggestion.action}
                                    className="bg-white hover:bg-orange-100 border-orange-200 text-orange-800"
                                >
                                    {suggestion.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
