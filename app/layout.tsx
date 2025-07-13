import type { Metadata } from "next";
import "./globals.css";
import { companyConfig } from "../config/company";

export const metadata: Metadata = {
  title: `سامانه آپلود فایل - ${companyConfig.company.name}`,
  description: `${companyConfig.messages.welcome} - ${companyConfig.company.type}`,
  keywords: `${companyConfig.company.name}, آپلود فایل, ${companyConfig.company.type}`,
  authors: [{ name: companyConfig.company.name }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className="font-sans antialiased"
        style={{
          fontFamily:
            '"iransans", "Vazirmatn", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
