// Company Configuration File
// برای تغییر شرکت، فقط این فایل را ویرایش کنید

export const companyConfig = {
  // اطلاعات اصلی شرکت
  company: {
    name: "موسسه حسابرسی قواعد",
    nameEn: "Ghavaed Audit Institute",
    shortName: "قواعد",
    type: "موسسه حسابرسی",
    establishedYear: "1385",
  },

  // اطلاعات تماس
  contact: {
    address: "تهران، میدان توحید ستارخان ابتدای کوثر دوم پلاک ۱ واحد ۵",
    phone: "02166597644",
    mobile: "09369360015",
    email: "mhqhavaed@yahoo.com",
    website: "www.qavaed.ir",
  },

  // خدمات
  services: [
    "حسابرسی صورت‌های مالی",
    "بازنگری عملکرد مالی",
    "مشاوره مالیاتی",
    "ارزیابی کنترل‌های داخلی",
    "مشاوره سیستم‌های حسابداری",
    "بررسی امکان‌سنجی سرمایه‌گذاری",
  ],

  // تنظیمات ظاهری
  theme: {
    primaryColor: "#1e40af", // آبی کلاسیک حسابداری
    secondaryColor: "#0ea5e9", // آبی روشن
    accentColor: "#059669", // سبز (سود)
    warningColor: "#dc2626", // قرمز (ضرر)
    backgroundColor: "#f8fafc",
    textColor: "#1e293b",
  },

  // مسیرهای لوگو و تصاویر
  assets: {
    logo: "/images/company/logo.svg",
    logoWhite: "/images/company/logo.svg",
    logoIcon: "/images/company/logo.svg",
    favicon: "/favicon.ico",
    watermark: "/images/favicon-32x32.png",
    letterhead: "/images/company/letterhead.jpg",
    // فونت‌های سیستم
    primaryFont: "iransans",
    fallbackFonts: [
      "Vazirmatn",
      "Segoe UI",
      "Tahoma",
      "Geneva",
      "Verdana",
      "sans-serif",
    ],
  },

  // تنظیمات سیستم
  system: {
    maxFileSize: 100, // مگابایت
    allowedFileTypes: [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "zip",
      "rar",
      "txt",
    ],
    defaultUserQuota: 100, // مگابایت
    maxUserQuota: 500, // مگابایت
    defaultExpiryHours: 72, // 3 روز
    maxExpiryHours: 720, // 30 روز
  },

  // پیام‌ها و متن‌های سیستم
  messages: {
    welcome: "به سامانه آپلود فایل موسسه حسابرسی قواعد خوش آمدید",
    loginMessage: "لطفاً با اطلاعات کاربری ارائه شده توسط موسسه وارد شوید",
    uploadSuccess: "فایل شما با موفقیت در سرورهای موسسه قواعد ذخیره شد",
    expiredAccount: "حساب کاربری شما منقضی شده است. لطفاً با موسسه تماس بگیرید",
    unauthorized: "شما مجوز دسترسی به این بخش را ندارید",
    fileDeleteWarning: "با حذف فایل، امکان بازیابی آن وجود نخواهد داشت",
  },

  // تنظیمات قانونی
  legal: {
    privacyPolicy:
      "تمامی فایل‌های آپلود شده محرمانه بوده و صرفاً برای اهداف حسابرسی استفاده می‌شود",
    termsOfUse:
      "استفاده از این سیستم منوط به رعایت قوانین موسسه و قوانین جمهوری اسلامی ایران است",
    dataRetention:
      "فایل‌ها پس از اتمام پروژه حسابرسی، به مدت 7 سال نگهداری می‌شوند",
    supportContact: "برای پشتیبانی فنی با شماره 021-66597644 تماس بگیرید",
  },

  // تنظیمات کاربران
  userTypes: {
    client: {
      name: "مشتری",
      permissions: ["upload", "download", "view"],
      defaultQuota: 100,
    },
    auditor: {
      name: "حسابرس",
      permissions: ["upload", "download", "view", "share"],
      defaultQuota: 200,
    },
    manager: {
      name: "مدیر پروژه",
      permissions: ["upload", "download", "view", "share", "manage"],
      defaultQuota: 300,
    },
    admin: {
      name: "مدیر سیستم",
      permissions: ["all"],
      defaultQuota: 500,
    },
  },
};

// Helper functions for easy access
export const getCompanyName = () => companyConfig.company.name;
export const getCompanyLogo = () => companyConfig.assets.logo;
export const getPrimaryColor = () => companyConfig.theme.primaryColor;
export const getContactInfo = () => companyConfig.contact;
export const getMaxFileSize = () => companyConfig.system.maxFileSize;
export const getAllowedFileTypes = () => companyConfig.system.allowedFileTypes;

export default companyConfig;
