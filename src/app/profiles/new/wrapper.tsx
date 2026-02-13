"use client";

import { ProfileForm } from "@/components/profiles/profile-form";
import { createProfile } from "../actions";
import { useState } from "react";

export function NewProfileWrapper() {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsProcessing(true);
        try {
            await createProfile(formData);
        } catch (error: any) {
            alert(error.message); // Simple fallback
            setIsProcessing(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProfileForm
                onSubmit={handleSubmit}
                submitLabel="ساخت پروفایل"
                isProcessing={isProcessing}
            />
        </div>
    );
}
