import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import BackupService, { BackupData } from "../services/backupService";
import { Download, Upload, RefreshCw, Calendar, Database } from "lucide-react";

export const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = () => {
    const allBackups = BackupService.getBackups();
    setBackups(allBackups);
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setStatusMessage(null);

    try {
      const success = await BackupService.createBackup();
      if (success) {
        setStatusMessage("✅ بک‌آپ با موفقیت ایجاد شد");
        loadBackups();
      } else {
        setStatusMessage("❌ خطا در ایجاد بک‌آپ");
      }
    } catch (error) {
      setStatusMessage("❌ خطا در ایجاد بک‌آپ");
    } finally {
      setIsCreatingBackup(false);
      // حذف پیام بعد از 3 ثانیه
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleRestoreBackup = async (index: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید از این بک‌آپ بازیابی کنید؟")) {
      return;
    }

    setIsRestoring(true);
    setStatusMessage(null);

    try {
      const success = await BackupService.restoreFromBackup(index);
      if (success) {
        setStatusMessage("✅ بازیابی با موفقیت انجام شد");
      } else {
        setStatusMessage("❌ خطا در بازیابی");
      }
    } catch (error) {
      setStatusMessage("❌ خطا در بازیابی");
    } finally {
      setIsRestoring(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleExportBackup = (index: number) => {
    const result = BackupService.exportBackup(index);
    if (result) {
      setStatusMessage("✅ بک‌آپ صادر شد");
    } else {
      setStatusMessage("❌ خطا در صادر کردن بک‌آپ");
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = BackupService.importBackup(jsonData);
        if (success) {
          setStatusMessage("✅ بک‌آپ با موفقیت وارد شد");
          loadBackups();
        } else {
          setStatusMessage("❌ خطا در وارد کردن بک‌آپ");
        }
      } catch (error) {
        setStatusMessage("❌ فایل بک‌آپ نامعتبر است");
      }
      setTimeout(() => setStatusMessage(null), 3000);
    };
    reader.readAsText(file);

    // Reset input value
    event.target.value = "";
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBackupSize = (backup: BackupData) => {
    const jsonString = JSON.stringify(backup);
    const sizeInBytes = new Blob([jsonString]).size;
    return (sizeInBytes / 1024).toFixed(2) + " KB";
  };

  return (
    <div className="space-y-6">
      {/* هدر و کنترل‌ها */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            مدیریت بک‌آپ سیستم
          </CardTitle>
          <CardDescription>
            ایجاد، بازیابی و مدیریت بک‌آپ‌های سیستم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isCreatingBackup ? "animate-spin" : ""}`}
              />
              {isCreatingBackup ? "در حال ایجاد..." : "ایجاد بک‌آپ جدید"}
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                وارد کردن بک‌آپ
              </Button>
            </div>
          </div>

          {statusMessage && (
            <Alert className="mt-4">
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* لیست بک‌آپ‌ها */}
      <Card>
        <CardHeader>
          <CardTitle>بک‌آپ‌های موجود ({backups.length})</CardTitle>
          <CardDescription>
            حداکثر {BackupService.config.maxBackups} بک‌آپ نگهداری می‌شود
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              هیچ بک‌آپی موجود نیست
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup, index) => (
                <div
                  key={backup.timestamp}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {formatDate(backup.timestamp)}
                        </span>
                        {index === 0 && (
                          <Badge variant="secondary">جدیدترین</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div>نسخه: {backup.version}</div>
                        <div>کاربران: {backup.userData?.length || 0}</div>
                        <div>فایل‌ها: {backup.fileList?.length || 0}</div>
                        <div>حجم: {getBackupSize(backup)}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportBackup(index)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        دانلود
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleRestoreBackup(index)}
                        disabled={isRestoring}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw
                          className={`h-3 w-3 ${isRestoring ? "animate-spin" : ""}`}
                        />
                        بازیابی
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* تنظیمات بک‌آپ */}
      <Card>
        <CardHeader>
          <CardTitle>تنظیمات بک‌آپ خودکار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <div className="font-medium text-gray-700">وضعیت:</div>
              <Badge
                variant={BackupService.config.enabled ? "default" : "secondary"}
              >
                {BackupService.config.enabled ? "فعال" : "غیرفعال"}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="font-medium text-gray-700">بازه زمانی:</div>
              <div>هر {BackupService.config.interval} ساعت</div>
            </div>

            <div className="space-y-1">
              <div className="font-medium text-gray-700">حداکثر بک‌آپ:</div>
              <div>{BackupService.config.maxBackups} عدد</div>
            </div>

            <div className="space-y-1">
              <div className="font-medium text-gray-700">شامل فایل‌ها:</div>
              <Badge
                variant={
                  BackupService.config.includeFiles ? "default" : "secondary"
                }
              >
                {BackupService.config.includeFiles ? "بله" : "خیر"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupManager;
