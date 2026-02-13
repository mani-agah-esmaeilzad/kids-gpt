import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        q: "آیا GPTKids واقعاً برای کودکان امن است؟",
        a: "بله، ایمنی اولویت اول ماست. ما از دو لایه فیلتر پیشرفته استفاده می‌کنیم: ۱) فیلتر کلمات و مفاهیم نامناسب قبل از پردازش، ۲) بررسی پاسخ هوش مصنوعی قبل از نمایش به کودک. علاوه بر این، والدین می‌توانند لیست سیاه کلمات را شخصی‌سازی کنند."
    },
    {
        q: "آیا اطلاعات کودک من ذخیره می‌شود؟",
        a: "خیر، ما اطلاعات شخصی کودک را ذخیره نمی‌کنیم و از مکالمات برای آموزش مدل‌های عمومی استفاده نمی‌شود. فقط والدین به تاریخچه گفتگوها دسترسی دارند."
    },
    {
        q: "مناسب چه گروه سنی است؟",
        a: "GPTKids برای کودکان ۳ تا ۱۵ سال طراحی شده است. محتوا و لحن پاسخ‌دهی بر اساس سن کودک (که در پروفایل تنظیم می‌کنید) تغییر می‌کند."
    },
    {
        q: "آیا می‌توانم روی چند دستگاه استفاده کنم؟",
        a: "بله، با یک اشتراک می‌توانید روی موبایل، تبلت و کامپیوتر وارد شوید و پروفایل‌های کودکان همگام‌سازی می‌شود."
    },
    {
        q: "هزینه اشتراک چقدر است؟",
        a: "ما پلن‌های متنوعی داریم. یک پلن رایگان محدود برای شروع و پلن‌های ماهانه/سالانه برای دسترسی کامل. ۳ روز اول استفاده از تمام امکانات رایگان است."
    },
    {
        q: "چگونه می‌توانم گزارش فعالیت‌ها را ببینم؟",
        a: "در داشبورد والدین، بخش گزارش‌ها، می‌توانید نمودار فعالیت روزانه، موضوعات مورد علاقه و هشدارهای ایمنی را مشاهده کنید."
    }
];

export function FaqSection() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        سوالات متداول
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        پاسخ به پرسش‌های رایج والدین
                    </p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="bg-white border mb-4 rounded-xl px-4 shadow-sm data-[state=open]:ring-2 ring-blue-100">
                            <AccordionTrigger className="text-right text-base font-medium py-4 hover:no-underline">{faq.q}</AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed pb-4">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
