import { PublicPage } from "@/components/public-page";

export default function TermsPage() {
  return (
    <PublicPage title="قوانین و شرایط" description="شرایط استفاده از GPTKids برای والدین و مدارس.">
      <div className="space-y-4 rounded-3xl bg-white/90 p-6 text-sm text-muted-foreground shadow-soft">
        <p>
          استفاده از GPTKids برای افراد زیر ۱۶ سال فقط با نظارت والدین یا مسئولین مدرسه مجاز است.
        </p>
        <p>
          هرگونه تلاش برای دور زدن محدودیت‌ها، تولید محتوای نامناسب یا درخواست اطلاعات شخصی ممنوع است.
        </p>
        <p>
          GPTKids ممکن است برای بهبود امنیت، برخی گفتگوها را به‌صورت ناشناس تحلیل کند. والدین در هر زمان می‌توانند درخواست حذف داده دهند.
        </p>
      </div>
    </PublicPage>
  );
}
