import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { FileUpload } from "./FileUpload";
import { ProgressBar } from "./ProgressBar";
import { TemporaryAccount, UploadedFile } from "../types";
import { FileService } from "../services/fileService";
import {
  Download,
  FileText,
  LogOut,
  Clock,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface UserDashboardProps {
  user: TemporaryAccount;
  onLogout: () => void;
}

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [userFiles, setUserFiles] = useState<UploadedFile[]>([]);
  const [usedQuota, setUsedQuota] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadUserFiles = () => {
    const files = FileService.getFilesByUserId(user.id);
    setUserFiles(files);

    const totalUsed = files.reduce((sum, file) => sum + file.fileSizeMb, 0);
    setUsedQuota(totalUsed);
  };

  useEffect(() => {
    loadUserFiles();
  }, [user.id]);

  const handleDownload = async (file: UploadedFile) => {
    try {
      const fileUrl = FileService.getFileUrl(file.id);
      if (fileUrl) {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = file.originalName || file.displayName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("خطا در دانلود فایل:", error);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    FileService.deleteFile(fileId);
    loadUserFiles();
    setDeleteConfirm(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const timeUntilExpiry = () => {
    const now = new Date().getTime();
    const expiry = user.expiresAt.getTime();
    const diff = expiry - now;

    if (diff <= 0) return "منقضی شده";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} ساعت و ${minutes} دقیقه`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType.startsWith("video/")) return "🎬";
    if (fileType.startsWith("audio/")) return "🎵";
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word")) return "📝";
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return "📊";
    if (fileType.includes("powerpoint") || fileType.includes("presentation"))
      return "📈";
    if (fileType.includes("zip") || fileType.includes("rar")) return "📦";
    return "📁";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div dir="rtl" className="space-y-2">
                <CardTitle className="text-2xl text-primary">
                  خوش آمدید، {user.username}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>انقضا: {timeUntilExpiry()}</span>
                  </div>
                  <Badge
                    variant={user.isActive ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {user.isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                </div>
              </div>
              <Button
                onClick={onLogout}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2 shadow-lg"
              >
                <LogOut className="h-4 w-4" />
                خروج
              </Button>
            </div>
          </CardHeader>
        </Card>
        {/* Storage Usage */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">
              میزان استفاده از فضای ذخیره‌سازی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar
              used={usedQuota}
              total={user.maxUploadQuotaMb}
              className="mb-4"
            />
            <div
              className="flex justify-between text-sm text-muted-foreground"
              dir="rtl"
            >
              <span>{usedQuota.toFixed(1)} مگابایت استفاده شده</span>
              <span>{user.maxUploadQuotaMb} مگابایت کل</span>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <FileUpload
          userId={user.id}
          onUpload={loadUserFiles}
          maxSizeMb={user.maxUploadQuotaMb}
          remainingQuotaMb={user.maxUploadQuotaMb - usedQuota}
        />

        {/* User Files */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg" dir="rtl">
              فایل‌های شما ({userFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userFiles.length === 0 ? (
              <div
                className="text-center text-muted-foreground py-12"
                dir="rtl"
              >
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">هنوز فایلی آپلود نکرده‌اید</p>
                <p className="text-sm">
                  برای شروع، از قسمت بالا فایل خود را آپلود کنید
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {userFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4" dir="rtl">
                        <div className="text-3xl">
                          {getFileIcon(file.fileType)}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            {file.displayName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {file.fileSizeMb.toFixed(1)} مگابایت •{" "}
                            {formatDate(file.uploadedAt)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file.originalName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(file)}
                          className="flex items-center gap-2 shadow-md hover:shadow-lg border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4" />
                          دانلود
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteConfirm(file.id)}
                          className="flex items-center gap-2 shadow-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                          حذف
                        </Button>
                      </div>
                    </div>
                    {index < userFiles.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4" dir="rtl">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-medium text-red-800">تأیید حذف فایل</h3>
              </div>
              <p className="text-red-700 mb-4" dir="rtl">
                آیا مطمئن هستید که می‌خواهید این فایل را حذف کنید؟ این عمل قابل
                برگشت نیست.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteConfirm(null)}
                  className="shadow-md"
                >
                  انصراف
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteFile(deleteConfirm)}
                  className="shadow-lg"
                >
                  حذف فایل
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
