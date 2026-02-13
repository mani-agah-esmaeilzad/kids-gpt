"use client";

import { ProfileForm } from "@/components/profiles/profile-form";
import { updateProfile } from "../actions";
import { useState } from "react";

export function EditProfileWrapper({
    childId,
    initialData
}: {
    childId: string;
    initialData: any
}) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsProcessing(true);
        try {
            await updateProfile(childId, formData);
        } catch (error: any) {
            alert(error.message);
            setIsProcessing(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProfileForm
                initialData={initialData}
                onSubmit={handleSubmit}
                submitLabel="ذخیره تغییرات"
                isProcessing={isProcessing}
            />
        </div>
    );
}
