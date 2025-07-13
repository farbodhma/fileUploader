# File Uploader - Next.js Application

یک برنامه آپلود فایل ساخته شده با Next.js، React، و Tailwind CSS.

## نحوه اجرای برنامه

### پیش‌نیازها

- Node.js (نسخه 18 یا بالاتر)
- npm یا yarn

### مراحل نصب و اجرا

1. **نصب وابستگی‌ها:**

   ```bash
   npm install
   ```

2. **اجرای برنامه در حالت development:**

   ```bash
   npm run dev
   ```

3. **اجرای برنامه در حالت production:**

   ```bash
   npm run build
   npm start
   ```

4. **بررسی کد:**
   ```bash
   npm run lint
   ```

## دسترسی به برنامه

بعد از اجرا، برنامه در آدرس زیر در دسترس خواهد بود:

- **Development:** http://localhost:3000
- **Production:** http://localhost:3000

## ساختار پروژه

```
fileUploader/
├── app/                 # App Router (Next.js 13+)
│   ├── globals.css     # استایل‌های عمومی
│   ├── layout.tsx      # Layout کلی برنامه
│   ├── page.tsx        # صفحه اصلی (Login)
│   ├── admin/          # صفحه مدیریت
│   └── user/           # صفحه کاربر
├── components/         # کامپوننت‌های React
│   ├── ui/            # کامپوننت‌های UI
│   ├── AdminDashboard.tsx
│   ├── UserDashboard.tsx
│   ├── LoginPage.tsx
│   └── ...
├── lib/               # توابع کمکی
├── services/          # سرویس‌های داده
├── types/             # تایپ‌های TypeScript
└── data/              # داده‌های تست
```

## ویژگی‌ها

- 🔐 سیستم احراز هویت برای کاربران و مدیران
- 📁 آپلود فایل با محدودیت حجم
- 👥 مدیریت حساب‌های موقت
- 📊 داشبورد مدیریت
- 🎨 UI مدرن با Tailwind CSS
- 📱 طراحی ریسپانسیو
- 🌐 پشتیبانی از زبان فارسی (RTL)

## اطلاعات ورود پیش‌فرض

### ادمین:

- نام کاربری: `admin`
- رمز عبور: `admin123`

### کاربر تست:

- نام کاربری: `testuser`
- رمز عبور: `password123`

## تکنولوژی‌های استفاده شده

- **Next.js 14** - فریمورک React
- **TypeScript** - تایپ‌گذاری
- **Tailwind CSS** - استایل‌دهی
- **Radix UI** - کامپوننت‌های UI
- **Lucide React** - آیکون‌ها

## توسعه

برای کمک به توسعه این پروژه:

1. پروژه را Fork کنید
2. یک branch جدید بسازید
3. تغییرات خود را commit کنید
4. Pull Request ارسال کنید

## مسائل و پشتیبانی

در صورت بروز مشکل، لطفا در Issues گزارش دهید.
