"use client";

import Image from "next/image";
import { getAvatarSrc } from "@/lib/avatars";
import { motion } from "framer-motion";

export function MascotHeader({ childName, avatarKey }: { childName: string; avatarKey: string }) {
    return (
        <div className="flex items-center gap-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
            >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-soft flex items-center justify-center border-2 border-white ring-4 ring-kid-blue/20 overflow-hidden">
                    <Image
                        src={getAvatarSrc(avatarKey)}
                        alt={childName}
                        width={80}
                        height={80}
                        className="object-cover"
                    />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-400 w-5 h-5 rounded-full border-2 border-white"></div>
            </motion.div>

            <div>
                <motion.h2
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-xl md:text-2xl font-black text-slate-800 tracking-tight"
                >
                    سلام {childName}! 👋
                </motion.h2>
                <p className="text-slate-500 text-sm md:text-base font-medium">امروز چی یاد بگیریم؟</p>
            </div>
        </div>
    );
}
