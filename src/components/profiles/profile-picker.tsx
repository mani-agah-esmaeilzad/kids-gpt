"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { getAvatarSrc } from "@/lib/avatars";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export type Profile = {
  id: string;
  nickname: string;
  ageGroup: string;
  avatarKey: string;
  isActive: boolean;
};

export function ProfilePicker({
  profiles,
  isParentLoggedIn,
  hasActivePlan
}: {
  profiles: Profile[];
  isParentLoggedIn: boolean;
  hasActivePlan: boolean;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize device session if needed
    fetch("/api/device/init", { method: "POST" }).catch(() => null);
  }, []);

  const handleSelect = async (childId: string) => {
    if (!hasActivePlan) return;
    setLoadingId(childId);
    try {
      await fetch("/api/profiles/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId })
      });
      // Redirect to kid dashboard
      window.location.href = "/kid/dashboard";
    } catch (error) {
      console.error("Failed to select profile", error);
      setLoadingId(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-5xl mx-auto px-4">
      <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-12 tracking-tight">
        چه کسی می‌خواهد یاد بگیرد؟
      </h1>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12"
      >
        {profiles.map((profile) => (
          <motion.button
            key={profile.id}
            variants={item}
            onClick={() => handleSelect(profile.id)}
            disabled={!profile.isActive || !hasActivePlan || !!loadingId}
            className="group flex flex-col items-center gap-4 relative focus:outline-none"
          >
            <div className={cn(
              "relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-focus:ring-4 ring-primary/30",
              "bg-white border-4 border-transparent group-hover:border-white overflow-hidden",
              loadingId === profile.id && "animate-pulse",
              !hasActivePlan && "opacity-75 grayscale"
            )}>
              <div className="relative w-24 h-24 md:w-32 md:h-32 transform transition-transform group-hover:rotate-6">
                <Image
                  src={getAvatarSrc(profile.avatarKey)}
                  alt={profile.nickname}
                  fill
                  className="object-contain"
                />
              </div>
              {!hasActivePlan && (
                <div className="absolute inset-0 bg-black/10 rounded-[2rem] flex items-center justify-center">
                  <Lock className="w-8 h-8 text-slate-600" />
                </div>
              )}
            </div>
            <span className={cn(
              "text-xl font-bold text-slate-600 group-hover:text-slate-900 transition-colors",
              loadingId === profile.id && "text-primary"
            )}>
              {loadingId === profile.id ? "در حال ورود..." : profile.nickname}
            </span>
          </motion.button>
        ))}

        {/* Add Profile Button */}
        <motion.div variants={item}>
          <Link href="/profiles/new" className="group flex flex-col items-center gap-4 focus:outline-none">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] flex items-center justify-center bg-white/50 border-4 border-dashed border-slate-300 text-slate-400 shadow-sm transition-all duration-300 group-hover:bg-white group-hover:border-primary group-hover:text-primary group-hover:scale-105">
              <Plus className="w-16 h-16" />
            </div>
            <span className="text-xl font-bold text-slate-400 group-hover:text-primary transition-colors">
              افزودن کودک
            </span>
          </Link>
        </motion.div>
      </motion.div>

      <div className="mt-20">
        <Button
          variant="ghost"
          size="lg"
          className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 gap-2 border border-transparent hover:border-slate-200"
          asChild
        >
          <Link href="/profiles/manage">
            <Settings className="w-5 h-5" />
            مدیریت پروفایل‌ها
          </Link>
        </Button>
      </div>

      {!hasActivePlan && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
          <p className="font-bold">
            اشتراک شما فعال نیست. لطفا برای ادامه <Link href="/pricing" className="underline hover:text-red-100">یک پلن انتخاب کنید</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
