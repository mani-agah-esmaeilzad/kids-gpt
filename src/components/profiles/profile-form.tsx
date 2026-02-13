"use client";

import Image from "next/image";

import { useState } from "react";
import { avatarOptions } from "@/lib/avatars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ProfileFormProps = {
    initialData?: {
        id?: string;
        nickname: string;
        ageGroup: string;
        avatarKey: string;
    };
    onSubmit: (data: FormData) => void;
    submitLabel: string;
    isProcessing?: boolean;
};

export function ProfileForm({ initialData, onSubmit, submitLabel, isProcessing }: ProfileFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nickname: initialData?.nickname || "",
        ageGroup: initialData?.ageGroup || "AGE_6_8",
        avatarKey: initialData?.avatarKey || "star",
    });

    const updateField = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        if (initialData?.id) data.append("id", initialData.id);
        data.append("nickname", formData.nickname);
        data.append("ageGroup", formData.ageGroup);
        data.append("avatarKey", formData.avatarKey);
        onSubmit(data);
    };

    const ageGroups = [
        { value: "AGE_6_8", label: "۶ تا ۸ سال", desc: "کنجکاو و بازیگوش" },
        { value: "AGE_9_12", label: "۹ تا ۱۲ سال", desc: "پرسشگر و خلاق" },
        { value: "AGE_13_15", label: "۱۳ تا ۱۵ سال", desc: "نوجوان و مستقل" },
    ];

    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-[2rem] shadow-soft overflow-hidden border border-slate-100">
            {/* Progress Bar */}
            <div className="h-2 bg-slate-100 w-full">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-12 min-h-[400px] flex flex-col justify-between">
                <AnimatePresence mode="wait">

                    {/* STEP 1: Name */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">نام فرزندتان چیست؟</h2>
                                <p className="text-slate-500">یک نام مستعار یا واقعی برای پروفایل انتخاب کنید.</p>
                            </div>

                            <div className="space-y-2 pt-4">
                                <Input
                                    value={formData.nickname}
                                    onChange={(e) => updateField("nickname", e.target.value)}
                                    placeholder="مثلاً: علی، روشا..."
                                    className="text-center text-lg h-14 rounded-xl border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                    autoFocus
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Age */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-slate-900">چند ساله است؟</h2>
                                <p className="text-slate-500">محتوا متناسب با سن کودک تنظیم می‌شود.</p>
                            </div>

                            <div className="grid gap-3 pt-2">
                                {ageGroups.map((group) => (
                                    <div
                                        key={group.value}
                                        onClick={() => updateField("ageGroup", group.value)}
                                        className={cn(
                                            "cursor-pointer rounded-xl border-2 p-4 flex items-center justify-between transition-all hover:bg-slate-50",
                                            formData.ageGroup === group.value
                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                : "border-slate-100"
                                        )}
                                    >
                                        <div>
                                            <p className="font-bold text-slate-900">{group.label}</p>
                                            <p className="text-xs text-slate-500">{group.desc}</p>
                                        </div>
                                        {formData.ageGroup === group.value && (
                                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Avatar */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-slate-900">انتخاب آواتار</h2>
                                <p className="text-slate-500">یک تصویر برای پروفایل انتخاب کنید.</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-2">
                                {avatarOptions.map((avatar) => (
                                    <div
                                        key={avatar.key}
                                        onClick={() => updateField("avatarKey", avatar.key)}
                                        className={cn(
                                            "aspect-square cursor-pointer rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 relative overflow-hidden",
                                            formData.avatarKey === avatar.key
                                                ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2"
                                                : "border-slate-100 bg-slate-50"
                                        )}
                                    >
                                        <div className="relative w-16 h-16">
                                            <Image
                                                src={avatar.src}
                                                alt={avatar.label}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-slate-600">{avatar.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                    {step > 1 ? (
                        <Button type="button" variant="ghost" onClick={handleBack} className="text-slate-500">
                            <ChevronRight className="w-4 h-4 ml-2" />
                            بازگشت
                        </Button>
                    ) : (
                        <div /> /* Spacer */
                    )}

                    {step < 3 ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={!formData.nickname && step === 1}
                            className="rounded-xl px-6"
                        >
                            مرحله بعد
                            <ChevronLeft className="w-4 h-4 mr-2" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isProcessing}
                            className="rounded-xl px-8 bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isProcessing ? "در حال ثبت..." : submitLabel}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
