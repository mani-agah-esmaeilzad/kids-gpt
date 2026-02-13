import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function FinalCta() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-16 text-center shadow-2xl sm:px-12 md:py-20">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                        آینده یادگیری کودکتان از اینجا شروع می‌شود
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100">
                        همین امروز به جمع هزاران خانواده‌ای بپیوندید که به GPTKids اعتماد کرده‌اند. ۳ روز استفاده رایگان برای شروع.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Button size="lg" className="h-14 px-8 text-lg rounded-2xl bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold shadow-lg" asChild>
                            <Link href="/signup">
                                شروع رایگان
                                <ArrowLeft className="mr-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-blue-200">
                        بدون نیاز به کارت اعتباری • لغو در هر زمان
                    </p>
                </div>
            </div>
        </section>
    );
}
