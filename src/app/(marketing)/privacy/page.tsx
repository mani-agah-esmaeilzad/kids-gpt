import { PublicPage } from "@/components/public-page";

export default function PrivacyPage() {
  return (
    <PublicPage
      title="سیاست حریم خصوصی"
      description="ما کمترین داده ممکن را ذخیره می‌کنیم و کنترل کامل را در اختیار والدین می‌گذاریم."
    >
      <div className="space-y-4 rounded-3xl bg-white/90 p-6 text-sm text-muted-foreground shadow-soft">
        <p>
          GPTKids اطلاعات شخصی حساس مانند آدرس، شماره تلفن، نام خانوادگی یا مدرسه را درخواست نمی‌کند و اگر کودک چنین اطلاعاتی را وارد کند، پیام مسدود می‌شود.
        </p>
        <p>
          والدین می‌توانند در هر زمان داده‌های کودک را دانلود یا حذف کنند. همه گزارش‌ها به‌صورت خلاصه و بدون ذخیره محتوای حساس ارائه می‌شوند.
        </p>
        <p>
          ما از رمزنگاری برای محافظت از داده‌ها و کوکی‌های امن برای احراز هویت استفاده می‌کنیم.
        </p>
      </div>
    </PublicPage>
  );
}
