import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
    {
        name: "رایگان",
        price: "۰ تومان",
        description: "برای شروع و آشنایی",
        features: ["۵۰ پیام در روز", "۱ پروفایل کودک", "گزارش‌های پایه", "محیط امن"],
        buttonText: "طرح فعلی",
        buttonVariant: "outline" as const,
        disabled: true,
    },
    {
        name: "پیشرفته",
        price: "۹۹,۰۰۰ تومان",
        period: "/ ماهانه",
        description: "دسترسی کامل و بدون محدودیت",
        features: [
            "پیام‌های نامحدود",
            "تا ۳ پروفایل کودک",
            "گزارش‌های تحلیلی کامل",
            "تنظیمات پیشرفته والدین",
            "اولویت در پاسخگویی",
        ],
        buttonText: "ارتقا به پیشرفته",
        buttonVariant: "default" as const,
        highlight: true,
    },
];

export function PricingCards() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            {plans.map((plan) => (
                <Card
                    key={plan.name}
                    className={`flex flex-col ${plan.highlight ? 'border-primary shadow-soft-lg scale-105' : 'shadow-soft'}`}
                >
                    <CardHeader>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">{plan.price}</span>
                            {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant={plan.buttonVariant} disabled={plan.disabled}>
                            {plan.buttonText}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
