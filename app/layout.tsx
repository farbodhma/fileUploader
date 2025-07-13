import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "آپلود فایل - File Uploader",
  description: "برنامه امن آپلود فایل",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
