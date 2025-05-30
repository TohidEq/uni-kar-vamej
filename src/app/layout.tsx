import type { Metadata } from "next";
import "@/styles/globals.scss";
import ThemeInitializer from "@/components/ThemeInitializer";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "کاروامج",
  description: "دنبال کار یا پروژه ای؟ کارومج برای تو ساخته شده",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`antialiased flex flex-col min-h-screen`}>
        <ThemeInitializer />
        {/* محتوا + رشددهنده برای گرفتن فضای خالی */}
        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
