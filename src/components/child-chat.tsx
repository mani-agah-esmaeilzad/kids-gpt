"use client";

import { useState, useRef, useEffect } from "react";
import { MascotHeader } from "@/components/shared/mascot-header";
import { ChatMessage } from "@/components/shared/chat-message";
import { ChatComposer } from "@/components/shared/chat-composer";
import { SuggestionChips } from "@/components/shared/suggestion-chips";
import { SafetyCard } from "@/components/shared/safety-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { getAvatarSrc } from "@/lib/avatars";

export type ChildChatProps = {
  child: {
    id: string;
    nickname: string;
    ageGroup: string;
    avatarKey: string;
  };
};

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export function ChildChat({ child }: ChildChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [safetyRefusal, setSafetyRefusal] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (content: string) => {
    if (!content.trim()) return;
    setSafetyRefusal(null);
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content }]);

    try {
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationId
        })
      });

      if (!res.ok || !res.body) {
        setLoading(false);
        // Handle error gracefully
        setMessages((prev) => [...prev, { role: "system", content: "اوه! ارتباط قطع شد. دوباره تلاش کن. 😕" }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      let buffer = "";
      // Initial empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // Handle potentially incomplete SSE data
        // For simplicity reusing the previous parsing logic but adapted
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? ""; // keep the last incomplete part

        for (const raw of parts) {
          if (!raw.trim()) continue;
          const lines = raw.split("\n");
          let event = "";
          let data = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) event = line.replace("event: ", "").trim();
            if (line.startsWith("data: ")) data = line.replace("data: ", "").trim();
          }

          if (event === "meta" && data) {
            try {
              const meta = JSON.parse(data);
              if (meta.conversationId) setConversationId(meta.conversationId);
            } catch (e) { }
          }
          if (event === "delta" && data) {
            try {
              const payload = JSON.parse(data);
              assistantMessage += payload.content ?? "";
              setMessages((prev) => {
                const copy = [...prev];
                const lastIdx = copy.length - 1;
                if (copy[lastIdx].role === "assistant") {
                  copy[lastIdx] = { ...copy[lastIdx], content: assistantMessage };
                }
                return copy;
              });
            } catch (e) { }
          }
          if (event === "replace" && data) {
            // Often used for safety blocks or final corrections
            try {
              const payload = JSON.parse(data);
              assistantMessage = payload.content;
              setMessages((prev) => {
                const copy = [...prev];
                const lastIdx = copy.length - 1;
                if (copy[lastIdx].role === "assistant") {
                  copy[lastIdx] = { ...copy[lastIdx], content: assistantMessage };
                }
                return copy;
              });
            } catch (e) { }
          }
          // Detect safety refusal (custom logic, assuming backend sends specific message or event)
          // If the content is exactly predefined refusal text, we could show SafetyCard
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "system", content: "یه مشکلی پیش اومد. ببخشید! 😔" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string) => {
    let prompt = "";
    switch (action) {
      case "explain-simple": prompt = "لطفاً همین رو ساده‌تر توضیح بده."; break;
      case "give-example": prompt = "یه مثال بزن که بهتر بفهمم."; break;
      case "read-aloud":
        // In a real app we would trigger TTS
        alert("این قابلیت هنوز فعال نشده!");
        return;
    }
    handleSubmit(prompt);
  };

  const avatarSrc = getAvatarSrc(child.avatarKey);

  return (
    <div className="flex flex-col h-full md:h-[85vh] w-full max-w-5xl mx-auto relative z-10 bg-white/30 backdrop-blur-sm md:bg-white/50 md:rounded-3xl md:shadow-sm md:border md:border-white/50 overflow-hidden">

      <ScrollArea className="flex-1 px-4 md:px-0">
        <div className="space-y-6 pb-4 pt-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in fade-in zoom-in duration-500 mt-4 md:mt-10">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/50 rounded-full flex items-center justify-center animate-bounce duration-2000">
                  <span className="text-3xl md:text-4xl">👋</span>
                </div>
              </div>
              <p className="text-slate-700 font-bold text-center text-lg md:text-2xl drop-shadow-sm bg-white/30 px-6 py-2 rounded-full backdrop-blur-md">
                من آماده‌ام! می‌تونی هر چی دوست داری بپرسی.
              </p>
              <SuggestionChips
                onSelect={handleSubmit}
                className="w-full max-w-2xl justify-center"
              />
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              content={msg.content}
              avatarSrc={msg.role === "assistant" ? "/mascot-head.png" : avatarSrc}
              onAction={handleAction}
              className="animate-in slide-in-from-bottom-2 duration-300"
            />
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 animate-pulse px-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">دارم فکر می‌کنم...</span>
            </div>
          )}

          {safetyRefusal && (
            <SafetyCard
              message={safetyRefusal}
              onClose={() => setSafetyRefusal(null)}
            />
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="mt-auto px-2 pb-4 md:pb-2 pt-2 bg-gradient-to-t from-kid-bg via-kid-bg/80 to-transparent sticky bottom-0 z-20">
        {messages.length > 0 && !loading && (
          <div className="mb-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            <SuggestionChips
              onSelect={handleSubmit}
              className="w-full flex-nowrap md:flex-wrap"
              suggestions={[
                { label: "ادامه بده", value: "ادامه بده", icon: null },
                { label: "جالبه!", value: "چه جالب! باز هم بگو", icon: null },
                { label: "یه سوال دیگه", value: "یه سوال دیگه دارم", icon: null },
              ]}
            />
          </div>
        )}
        <ChatComposer onSend={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
}
