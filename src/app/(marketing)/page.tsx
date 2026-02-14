import { HeroSection } from "@/components/marketing/hero-section";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { PricingCards } from "@/components/pricing-cards"; // Reusing existing component but wrapping it

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function MarketingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />
            <TrustStrip />
            <FeaturesGrid />

            {/* Pricing Section Wrapper */}
            <section className="py-24 bg-white" id="pricing">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            اشتراک مقرون به صرفه
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            سرمایه‌گذاری روی آینده و امنیت کودک، با قیمت یک پیتزا
                        </p>
                    </div>
                    <PricingCards />
                </div>
            </section>

            <FaqSection />
            <FinalCta />
        </div>
    );
}
