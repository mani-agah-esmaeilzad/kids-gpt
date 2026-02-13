import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "GPTKids | چت‌بات امن کودکان",
  description:
    "GPTKids یک چت‌بات کودک‌محور، امن و فارسی است که با کنترل والدین و گزارش‌های دقیق، تجربه‌ای مطمئن برای زیر ۱۶ سال فراهم می‌کند."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
