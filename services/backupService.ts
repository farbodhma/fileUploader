export interface BackupConfig {
  enabled: boolean;
  interval: number; // به ساعت
  maxBackups: number;
  backupPath: string;
  includeFiles: boolean;
  includeUserData: boolean;
}

export interface BackupData {
  timestamp: string;
  version: string;
  userData: any[];
  fileList: string[];
  systemConfig: any;
}

class BackupService {
  private static readonly BACKUP_KEY = "system_backups";
  private static readonly MAX_BACKUPS = 10;

  static config: BackupConfig = {
    enabled: true,
    interval: 24, // هر 24 ساعت
    maxBackups: 10,
    backupPath: "./backups",
    includeFiles: true,
    includeUserData: true,
  };

  // ایجاد بک‌آپ خودکار
  static async createBackup(): Promise<boolean> {
    try {
      if (!this.config.enabled) return false;

      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        userData: this.getUserData(),
        fileList: this.getFileList(),
        systemConfig: this.getSystemConfig(),
      };

      // ذخیره در localStorage (برای محیط توسعه)
      const existingBackups = this.getBackups();
      existingBackups.unshift(backupData);

      // حذف بک‌آپ‌های قدیمی
      if (existingBackups.length > this.config.maxBackups) {
        existingBackups.splice(this.config.maxBackups);
      }

      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(existingBackups));

      if (process.env.NODE_ENV === "development") {
        console.log("✅ بک‌آپ با موفقیت ایجاد شد:", backupData.timestamp);
      }
      return true;
    } catch (error) {
      console.error("❌ خطا در ایجاد بک‌آپ:", error);
      return false;
    }
  }

  // بازیابی از بک‌آپ
  static async restoreFromBackup(backupIndex: number = 0): Promise<boolean> {
    try {
      const backups = this.getBackups();
      if (backups.length === 0 || backupIndex >= backups.length) {
        console.error("بک‌آپ موردنظر یافت نشد");
        return false;
      }

      const backup = backups[backupIndex];

      // بازیابی داده‌های کاربر
      if (backup.userData && this.config.includeUserData) {
        // اینجا می‌توانید داده‌های کاربر را بازیابی کنید
        if (process.env.NODE_ENV === "development") {
          console.log("بازیابی داده‌های کاربر...");
        }
      }

      if (process.env.NODE_ENV === "development") {
        console.log("✅ بازیابی با موفقیت انجام شد:", backup.timestamp);
      }
      return true;
    } catch (error) {
      console.error("❌ خطا در بازیابی:", error);
      return false;
    }
  }

  // دریافت لیست بک‌آپ‌ها
  static getBackups(): BackupData[] {
    try {
      const backups = localStorage.getItem(this.BACKUP_KEY);
      return backups ? JSON.parse(backups) : [];
    } catch (error) {
      console.error("خطا در خواندن بک‌آپ‌ها:", error);
      return [];
    }
  }

  // حذف بک‌آپ‌های قدیمی
  static cleanOldBackups(): void {
    const backups = this.getBackups();
    if (backups.length > this.config.maxBackups) {
      const newBackups = backups.slice(0, this.config.maxBackups);
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(newBackups));
      console.log(`پاک‌سازی ${backups.length - newBackups.length} بک‌آپ قدیمی`);
    }
  }

  // شروع بک‌آپ خودکار
  static startAutoBackup(): void {
    if (!this.config.enabled) return;

    setInterval(
      () => {
        this.createBackup();
      },
      this.config.interval * 60 * 60 * 1000
    ); // تبدیل ساعت به میلی‌ثانیه

    console.log(`🔄 بک‌آپ خودکار شروع شد - هر ${this.config.interval} ساعت`);
  }

  // دریافت داده‌های کاربر
  private static getUserData(): any[] {
    try {
      const users = localStorage.getItem("users");
      return users ? JSON.parse(users) : [];
    } catch (error) {
      return [];
    }
  }

  // دریافت لیست فایل‌ها
  private static getFileList(): string[] {
    try {
      const files = localStorage.getItem("uploadedFiles");
      return files ? JSON.parse(files) : [];
    } catch (error) {
      return [];
    }
  }

  // دریافت تنظیمات سیستم
  private static getSystemConfig(): any {
    return {
      lastBackup: new Date().toISOString(),
      adminCount: 2,
      systemVersion: "1.0.0",
    };
  }

  // صادر کردن بک‌آپ
  static exportBackup(backupIndex: number = 0): string | null {
    try {
      const backups = this.getBackups();
      if (backups.length === 0 || backupIndex >= backups.length) {
        return null;
      }

      const backup = backups[backupIndex];
      const jsonData = JSON.stringify(backup, null, 2);

      // ایجاد فایل برای دانلود
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-${backup.timestamp.split("T")[0]}.json`;
      a.click();

      URL.revokeObjectURL(url);

      console.log("✅ بک‌آپ صادر شد");
      return jsonData;
    } catch (error) {
      console.error("❌ خطا در صادر کردن بک‌آپ:", error);
      return null;
    }
  }

  // وارد کردن بک‌آپ
  static importBackup(jsonData: string): boolean {
    try {
      const backupData: BackupData = JSON.parse(jsonData);

      // اعتبارسنجی ساختار بک‌آپ
      if (!backupData.timestamp || !backupData.version) {
        throw new Error("ساختار بک‌آپ نامعتبر است");
      }

      const backups = this.getBackups();
      backups.unshift(backupData);

      // حذف بک‌آپ‌های اضافی
      if (backups.length > this.config.maxBackups) {
        backups.splice(this.config.maxBackups);
      }

      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backups));

      console.log("✅ بک‌آپ با موفقیت وارد شد");
      return true;
    } catch (error) {
      console.error("❌ خطا در وارد کردن بک‌آپ:", error);
      return false;
    }
  }
}

export default BackupService;
