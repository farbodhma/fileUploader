// تنظیمات امنیتی فایل آپلود
export const FILE_UPLOAD_CONFIG = {
  // حداکثر اندازه فایل (بایت)
  maxFileSize: (() => {
    const sizeStr = process.env.MAX_FILE_SIZE?.replace("MB", "");
    const sizeMB = sizeStr ? parseInt(sizeStr) : 50;
    return sizeMB * 1024 * 1024;
  })(),

  // انواع فایل‌های مجاز
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(",") || [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "jpg",
    "jpeg",
    "png",
  ],

  // MIME types مجاز
  allowedMimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "text/plain",
  ],

  // پیام‌های خطا
  errorMessages: {
    fileTooLarge: `حداکثر اندازه فایل ${process.env.MAX_FILE_SIZE || "50MB"} است`,
    invalidFileType: "نوع فایل مجاز نیست",
    invalidMimeType: "فرمت فایل معتبر نیست",
    uploadFailed: "خطا در آپلود فایل",
  },
};

// بررسی اعتبار فایل
export const validateFile = (
  file: File
): { isValid: boolean; error?: string } => {
  // بررسی اندازه فایل
  if (file.size > FILE_UPLOAD_CONFIG.maxFileSize) {
    return {
      isValid: false,
      error: FILE_UPLOAD_CONFIG.errorMessages.fileTooLarge,
    };
  }

  // بررسی پسوند فایل
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (
    !fileExtension ||
    !FILE_UPLOAD_CONFIG.allowedFileTypes.includes(fileExtension)
  ) {
    return {
      isValid: false,
      error: FILE_UPLOAD_CONFIG.errorMessages.invalidFileType,
    };
  }

  // بررسی MIME type
  if (!FILE_UPLOAD_CONFIG.allowedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: FILE_UPLOAD_CONFIG.errorMessages.invalidMimeType,
    };
  }

  return { isValid: true };
};

// تنظیمات HTTPS
export const SECURITY_CONFIG = {
  httpsOnly: process.env.NODE_ENV === "production",
  secureCookies: process.env.SECURE_COOKIES === "true",
  sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || "3600") * 1000, // تبدیل به میلی‌ثانیه

  // هدرهای امنیتی
  securityHeaders: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  },
};

export default FILE_UPLOAD_CONFIG;
