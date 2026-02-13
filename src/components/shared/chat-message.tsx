import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, User, Volume2, HelpCircle, Layers, Star } from "lucide-react";

interface ChatMessageProps {
    role: "user" | "assistant" | "system";
    content: string;
    avatarSrc?: string;
    onAction?: (action: string) => void;
    className?: string;
}

export function ChatMessage({ role, content, avatarSrc, onAction, className }: ChatMessageProps) {
    const isUser = role === "user";
    const isSystem = role === "system";

    if (isSystem) {
        return (
            <div className={cn("flex justify-center my-6", className)}>
                <div className="bg-white/80 backdrop-blur-sm text-slate-600 px-6 py-2 rounded-full text-sm font-bold shadow-sm border border-slate-200">
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div className={cn(
            "flex w-full gap-4 md:gap-6 group",
            isUser ? "flex-row-reverse" : "flex-row",
            className
        )}>
            {/* Avatar with bouncy effect */}
            <div className={cn(
                "relative transition-transform duration-300 group-hover:scale-110",
                isUser ? "-ml-2" : "-mr-2"
            )}>
                <Avatar className={cn(
                    "h-12 w-12 md:h-16 md:w-16 border-4 shadow-md",
                    isUser ? "border-white ring-4 ring-blue-100" : "border-white ring-4 ring-purple-100"
                )}>
                    <AvatarImage src={avatarSrc} className="object-cover" />
                    <AvatarFallback className={isUser ? "bg-blue-100 text-blue-500" : "bg-purple-100 text-purple-500"}>
                        {isUser ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                    </AvatarFallback>
                </Avatar>

                {/* Decoration */}
                <div className={cn(
                    "absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-sm text-[10px]",
                    isUser ? "bg-blue-500" : "bg-purple-500"
                )}>
                    <Star className="w-3 h-3 fill-current" />
                </div>
            </div>

            <div className={cn("flex flex-col max-w-[85%] md:max-w-[75%]", isUser ? "items-end" : "items-start")}>
                {/* Name Label */}
                <span className={cn(
                    "text-xs font-bold text-slate-400 mb-1 px-2",
                    isUser ? "text-right" : "text-left"
                )}>
                    {isUser ? "تو" : "هوش مصنوعی"}
                </span>

                {/* Message Bubble */}
                <div
                    className={cn(
                        "relative px-6 py-4 text-base md:text-lg leading-relaxed shadow-sm transition-all duration-300 hover:shadow-md",
                        isUser
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[2rem] rounded-tr-sm"
                            : "bg-white text-slate-800 border-2 border-slate-100 rounded-[2rem] rounded-tl-sm"
                    )}
                >
                    {content}
                </div>

                {/* Action Buttons */}
                {!isUser && onAction && (
                    <div className="mt-3 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-white text-xs border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 h-9 px-4 font-bold shadow-sm"
                            onClick={() => onAction("explain-simple")}
                        >
                            <HelpCircle className="mr-1.5 h-4 w-4" />
                            ساده‌تر بگو
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-white text-xs border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 h-9 px-4 font-bold shadow-sm"
                            onClick={() => onAction("give-example")}
                        >
                            <Layers className="mr-1.5 h-4 w-4" />
                            مثال بزن
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-slate-400 hover:text-purple-600 hover:bg-purple-50"
                            onClick={() => onAction("read-aloud")}
                        >
                            <Volume2 className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
