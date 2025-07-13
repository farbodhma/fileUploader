#!/usr/bin/env node

/**
 * اسکریپت تولید کلیدهای امنیتی برای محیط تولید
 * استفاده: node generate-keys.js
 */

const crypto = require("crypto");

function generateSecureKey(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

function generateSecurePassword(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

console.log("🔐 تولید کلیدهای امنیتی برای محیط تولید\n");

console.log(
  "# کلیدهای امنیتی - این مقادیر را در فایل .env.production خود کپی کنید"
);
console.log("# ⚠️ هشدار: این کلیدها را در جای امن نگهداری کنید\n");

console.log("# کلید رمزنگاری اصلی");
console.log(`ENCRYPTION_KEY=${generateSecureKey(64)}\n`);

console.log("# رمزهای عبور پیشنهادی برای ادمین‌ها (تغییر دهید)");
console.log(`ADMIN_PASSWORD_1=${generateSecurePassword(20)}`);
console.log(`ADMIN_PASSWORD_2=${generateSecurePassword(20)}\n`);

console.log("# کلیدهای اضافی");
console.log(`JWT_SECRET=${generateSecureKey(32)}`);
console.log(`SESSION_SECRET=${generateSecureKey(32)}\n`);

console.log("📝 نکات مهم:");
console.log("1. این کلیدها را هرگز در کد خود هاردکد نکنید");
console.log("2. فایل .env.production را در .gitignore قرار دهید");
console.log("3. رمزهای عبور را به کاربران مربوطه اطلاع دهید");
console.log("4. پس از استقرار، رمزهای پیش‌فرض را تغییر دهید");
