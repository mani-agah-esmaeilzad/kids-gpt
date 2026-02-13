import { Shield, Clock, Eye, Lock } from "lucide-react";

const trustItems = [
    {
        icon: Shield,
        title: "محتوی امن",
        desc: "فیلتر هوشمند کلمات و مفاهیم نامناسب"
    },
    {
        icon: Clock,
        title: "محدودیت زمان",
        desc: "تعیین سقف استفاده روزانه توسط والدین"
    },
    {
        icon: Eye,
        title: "گزارش فعالیت",
        desc: "مشاهده موضوعات گفتگو و علایق کودک"
    },
    {
        icon: Lock,
        title: "حریم خصوصی",
        desc: "بدون ذخیره اطلاعات شخصی و تبلیغات"
    }
];

export function TrustStrip() {
    return (
        <section className="border-y bg-white py-12">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {trustItems.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{item.title}</h3>
                                <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
