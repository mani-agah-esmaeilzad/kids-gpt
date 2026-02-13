import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqPage() {
  const faqs = [
    {
      question: "آیا KidsGPT برای کودکان زیر ۵ سال مناسب است؟",
      answer: "بله، ما حالت ویژه‌ای برای کودکان پیش از دبستان داریم که بیشتر بر پایه تصاویر و صدا کار می‌کند و نیاز به خواندن و نوشتن ندارد."
    },
    {
      question: "چگونه محتوای نامناسب فیلتر می‌شود؟",
      answer: "ما از یک سیستم سه لایه استفاده می‌کنیم: ۱. فیلتر کلمات کلیدی، ۲. هوش مصنوعی ناظر که محتوا را بررسی می‌کند، و ۳. گزارش‌دهی کاربران. تقریبا ۹۹.۹٪ محتوای نامناسب قبل از نمایش حذف می‌شود."
    },
    {
      question: "آیا می‌توانم اکانت اشتراکی داشته باشم؟",
      answer: "بله، در پلن خانواده شما می‌توانید تا ۵ پروفایل کودک مختلف داشته باشید که هر کدام تاریخچه و تنظیمات مخصوص به خود را دارند."
    },
    {
      question: "آیا این سرویس جایگزین معلم می‌شود؟",
      answer: "خیر، KidsGPT یک ابزار کمک آموزشی است. هدف ما تقویت یادگیری است، نه جایگزینی تعاملات انسانی با معلم یا والدین."
    },
    {
      question: "چطور اشتراکم را لغو کنم؟",
      answer: "خیلی ساده! از منوی تنظیمات والدین، بخش صورت‌حساب، می‌توانید هر زمان که خواستید تمدید خودکار را غیرفعال کنید."
    }
  ];

  return (
    <div className="py-16">
      <div className="container px-4 md:px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-center text-slate-900 mb-4">سوالات متداول</h1>
        <p className="text-xl text-center text-slate-600 mb-12">
          سوالاتی که شاید برای شما هم پیش آمده باشد.
        </p>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border rounded-2xl px-6 bg-white shadow-sm data-[state=open]:ring-2 ring-primary/20">
              <AccordionTrigger className="text-lg font-bold text-slate-800 hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
