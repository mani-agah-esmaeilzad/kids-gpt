"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatComposerProps {
    onSend: (message: string) => void;
    isLoading?: boolean;
}

export function ChatComposer({ onSend, isLoading }: ChatComposerProps) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;
        onSend(input);
        setInput("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        // Auto-resize
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 p-2 bg-white/80 backdrop-blur-md rounded-[2rem] border-2 border-slate-200 shadow-xl ring-4 ring-white/50 transition-all focus-within:border-blue-400 focus-within:ring-blue-200">
            <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full h-12 w-12 text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                onClick={() => alert("به زودی: ضبط صدا! 🎤")}
            >
                <Mic className="h-6 w-6" />
            </Button>

            <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="اینجا بنویس..."
                className="flex-1 min-h-[48px] max-h-[150px] bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-slate-400 resize-none py-3"
                rows={1}
            />

            <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className={cn(
                    "rounded-[1.5rem] h-12 w-12 transition-all duration-300 shadow-md",
                    input.trim() && !isLoading
                        ? "bg-gradient-to-tr from-blue-500 to-cyan-500 hover:scale-110 hover:shadow-lg text-white"
                        : "bg-slate-200 text-slate-400"
                )}
            >
                <Send className={cn("h-6 w-6", input.trim() && "ml-1")} />
            </Button>
        </form>
    );
}
