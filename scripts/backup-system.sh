#!/bin/bash

# اسکریپت بک‌آپ خودکار سیستم
# استفاده: ./backup-system.sh

BACKUP_DIR="/var/backups/fileuploader"
APP_DIR="/var/www/fileuploader"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="fileuploader_backup_$DATE"

echo "📦 شروع بک‌آپ سیستم..."

# ایجاد پوشه بک‌آپ
mkdir -p $BACKUP_DIR

# بک‌آپ فایل‌های آپلود شده
echo "📁 بک‌آپ فایل‌های آپلود شده..."
if [ -d "$APP_DIR/uploads" ]; then
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_uploads.tar.gz" -C "$APP_DIR" uploads
    echo "✅ فایل‌های آپلود شده بک‌آپ شدند"
fi

# بک‌آپ تنظیمات
echo "⚙️ بک‌آپ تنظیمات..."
if [ -f "$APP_DIR/.env.production" ]; then
    cp "$APP_DIR/.env.production" "$BACKUP_DIR/${BACKUP_NAME}_env.backup"
    echo "✅ فایل تنظیمات بک‌آپ شد"
fi

# بک‌آپ داده‌های localStorage (اگر موجود باشد)
echo "💾 بک‌آپ داده‌های سیستم..."
if [ -d "$APP_DIR/data" ]; then
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_data.tar.gz" -C "$APP_DIR" data
    echo "✅ داده‌های سیستم بک‌آپ شدند"
fi

# بک‌آپ لاگ‌ها
echo "📋 بک‌آپ لاگ‌ها..."
if [ -d "$APP_DIR/logs" ]; then
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_logs.tar.gz" -C "$APP_DIR" logs
    echo "✅ لاگ‌ها بک‌آپ شدند"
fi

# حذف بک‌آپ‌های قدیمی (بیش از 30 روز)
echo "🧹 پاک‌سازی بک‌آپ‌های قدیمی..."
find $BACKUP_DIR -name "fileuploader_backup_*" -mtime +30 -delete
echo "✅ بک‌آپ‌های قدیمی حذف شدند"

# ایجاد فایل اطلاعات بک‌آپ
echo "📝 ایجاد فایل اطلاعات..."
cat > "$BACKUP_DIR/${BACKUP_NAME}_info.txt" << EOF
تاریخ بک‌آپ: $(date)
نسخه سیستم: $(cat $APP_DIR/package.json | grep version | cut -d'"' -f4)
تعداد فایل‌های آپلود شده: $(find $APP_DIR/uploads -type f 2>/dev/null | wc -l)
حجم کل فایل‌ها: $(du -sh $APP_DIR/uploads 2>/dev/null | cut -f1)
وضعیت سرویس: $(systemctl is-active fileuploader)
EOF

echo "✅ بک‌آپ سیستم با موفقیت کامل شد!"
echo "📍 مسیر بک‌آپ: $BACKUP_DIR"
echo "📊 فایل‌های ایجاد شده:"
ls -la "$BACKUP_DIR/${BACKUP_NAME}_"*
