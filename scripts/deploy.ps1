# اسکریپت راه‌اندازی سرور تولید برای Windows
# استفاده: .\deploy.ps1

Write-Host "🚀 شروع فرآیند استقرار سرور تولید..." -ForegroundColor Green

# بررسی وجود Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js یافت شد: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js یافت نشد. لطفاً ابتدا Node.js را نصب کنید." -ForegroundColor Red
    exit 1
}

# بررسی وجود npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm یافت شد: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm یافت نشد. لطفاً ابتدا npm را نصب کنید." -ForegroundColor Red
    exit 1
}

Write-Host "📦 نصب وابستگی‌ها..." -ForegroundColor Yellow
npm ci --production

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ خطا در نصب وابستگی‌ها" -ForegroundColor Red
    exit 1
}

Write-Host "🏗️ ساخت نسخه تولید..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ خطا در ساخت پروژه" -ForegroundColor Red
    exit 1
}

# ایجاد پوشه‌های ضروری
Write-Host "📁 ایجاد پوشه‌های سیستم..." -ForegroundColor Yellow
$uploadPath = ".\uploads"
$backupPath = ".\backups"
$logPath = ".\logs"

if (!(Test-Path $uploadPath)) {
    New-Item -ItemType Directory -Path $uploadPath -Force
    Write-Host "✅ پوشه uploads ایجاد شد" -ForegroundColor Green
}

if (!(Test-Path $backupPath)) {
    New-Item -ItemType Directory -Path $backupPath -Force
    Write-Host "✅ پوشه backups ایجاد شد" -ForegroundColor Green
}

if (!(Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath -Force
    Write-Host "✅ پوشه logs ایجاد شد" -ForegroundColor Green
}

# کپی فایل محیط تولید
if (Test-Path ".env.production") {
    Write-Host "⚙️ کپی تنظیمات محیط تولید..." -ForegroundColor Yellow
    Copy-Item ".env.production" ".env.local" -Force
    Write-Host "✅ فایل .env.local ایجاد شد" -ForegroundColor Green
} else {
    Write-Host "⚠️ فایل .env.production یافت نشد!" -ForegroundColor Yellow
    Write-Host "لطفاً فایل .env.production را بسازید و تنظیمات مناسب را وارد کنید." -ForegroundColor Yellow
}

Write-Host "✅ راه‌اندازی کامل شد!" -ForegroundColor Green
Write-Host "🎯 برای شروع سرور دستور زیر را اجرا کنید:" -ForegroundColor Cyan
Write-Host "npm start" -ForegroundColor White

# اختیاری: شروع خودکار سرور
$response = Read-Host "آیا می‌خواهید سرور را الان شروع کنید؟ (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "🚀 شروع سرور..." -ForegroundColor Green
    npm start
}
