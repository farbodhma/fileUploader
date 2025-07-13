#!/bin/bash

# اسکریپت راه‌اندازی سرور تولید
# استفاده: ./deploy.sh

echo "🚀 شروع فرآیند استقرار سرور تولید..."

# بررسی وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد. لطفاً ابتدا Node.js را نصب کنید."
    exit 1
fi

# بررسی وجود npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm یافت نشد. لطفاً ابتدا npm را نصب کنید."
    exit 1
fi

echo "📦 نصب وابستگی‌ها..."
npm ci --production

echo "🏗️ ساخت نسخه تولید..."
npm run build

# ایجاد پوشه‌های ضروری
echo "📁 ایجاد پوشه‌های سیستم..."
mkdir -p /var/uploads
mkdir -p /var/backups
mkdir -p /var/logs

# تنظیم مجوزها
echo "🔐 تنظیم مجوزهای فایل..."
chmod 755 /var/uploads
chmod 755 /var/backups
chmod 755 /var/logs

# کپی فایل محیط تولید
if [ -f ".env.production" ]; then
    echo "⚙️ کپی تنظیمات محیط تولید..."
    cp .env.production .env.local
else
    echo "⚠️ فایل .env.production یافت نشد!"
fi

echo "✅ راه‌اندازی کامل شد!"
echo "🎯 برای شروع سرور دستور زیر را اجرا کنید:"
echo "npm start"

# اختیاری: شروع خودکار سرور
read -p "آیا می‌خواهید سرور را الان شروع کنید؟ (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 شروع سرور..."
    npm start
fi
