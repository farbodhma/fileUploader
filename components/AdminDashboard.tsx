import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { TemporaryAccount, UploadedFile } from "../types";
import { UserService } from "../services/userService";
import { FileService } from "../services/fileService";
import { companyConfig } from "../config/company";
import { Footer } from "./Footer";
import {
  Users,
  Files,
  LogOut,
  Download,
  FileText,
  UserPlus,
  Clock,
  HardDrive,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [users, setUsers] = useState<TemporaryAccount[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "user" | "file";
    id: string;
  } | null>(null);
  const [success, setSuccess] = useState("");
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    password: "",
    maxUploadQuotaMb: 50,
    expiresInHours: 24,
  });

  const loadData = () => {
    setUsers(UserService.getAllUsers());
    setFiles(FileService.getAllFiles());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = () => {
    if (!newUserForm.username.trim() || !newUserForm.password.trim()) {
      return;
    }

    // Check if username already exists
    const existingUser = users.find((u) => u.username === newUserForm.username);
    if (existingUser) {
      alert("نام کاربری قبلاً استفاده شده است.");
      return;
    }

    try {
      UserService.createUser({
        username: newUserForm.username,
        password: newUserForm.password,
        maxUploadQuotaMb: newUserForm.maxUploadQuotaMb,
        expiresAt: new Date(
          Date.now() + newUserForm.expiresInHours * 60 * 60 * 1000
        ),
        isActive: true,
      });

      setSuccess("کاربر جدید با موفقیت ایجاد شد.");
      setNewUserForm({
        username: "",
        password: "",
        maxUploadQuotaMb: 50,
        expiresInHours: 24,
      });
      loadData();
    } catch (error) {
      console.error("خطا در ایجاد کاربر:", error);
    }
  };

  const handleDeleteUser = (userId: string) => {
    // Delete user's files first
    const userFiles = FileService.getFilesByUserId(userId);
    userFiles.forEach((file) => FileService.deleteFile(file.id));

    // Then delete user
    UserService.deleteUser(userId);
    loadData();
    setDeleteConfirm(null);
    setSuccess("کاربر و فایل‌های آن با موفقیت حذف شد.");
  };

  const handleDeleteFile = (fileId: string) => {
    FileService.deleteFile(fileId);
    loadData();
    setDeleteConfirm(null);
    setSuccess("فایل با موفقیت حذف شد.");
  };

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

  const getUserFiles = (userId: string) => {
    return files.filter((file) => file.userId === userId);
  };

  const getUserUsedQuota = (userId: string) => {
    return getUserFiles(userId).reduce((sum, file) => sum + file.fileSizeMb, 0);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  };

  const isExpired = (user: TemporaryAccount) => {
    const expiryDate =
      typeof user.expiresAt === "string"
        ? new Date(user.expiresAt)
        : user.expiresAt;
    return expiryDate.getTime() < Date.now();
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

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive && !isExpired(u)).length;
  const totalFiles = files.length;
  const totalStorageUsed = files.reduce(
    (sum, file) => sum + file.fileSizeMb,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-4" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div dir="rtl">
                <CardTitle className="flex items-center gap-3">
                  <img
                    src={companyConfig.assets.logoIcon}
                    alt={companyConfig.company.name}
                    className="h-8 w-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  پنل مدیریت {companyConfig.company.name}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  مدیریت کاربران و فایل‌های آپلود شده
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={onLogout}
                className="shadow-lg"
              >
                <LogOut className="h-4 w-4 ml-2" />
                خروج
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Success Message */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2" dir="rtl">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-semibold">{totalUsers}</p>
                  <p className="text-sm text-gray-600">کل کاربران</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2" dir="rtl">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-semibold">{activeUsers}</p>
                  <p className="text-sm text-gray-600">کاربران فعال</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2" dir="rtl">
                <Files className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-semibold">{totalFiles}</p>
                  <p className="text-sm text-gray-600">کل فایل‌ها</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2" dir="rtl">
                <HardDrive className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-semibold">
                    {totalStorageUsed.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">مگابایت استفاده شده</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">مدیریت کاربران</TabsTrigger>
            <TabsTrigger value="files">مدیریت فایل‌ها</TabsTrigger>
            <TabsTrigger value="create">ایجاد کاربر جدید</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle dir="rtl">لیست کاربران ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user, index) => {
                    const userFiles = getUserFiles(user.id);
                    const usedQuota = getUserUsedQuota(user.id);
                    const expired = isExpired(user);

                    return (
                      <div key={user.id}>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div dir="rtl">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">
                                  {user.username}
                                </h3>
                                <Badge
                                  variant={
                                    expired
                                      ? "destructive"
                                      : user.isActive
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {expired
                                    ? "منقضی شده"
                                    : user.isActive
                                      ? "فعال"
                                      : "غیرفعال"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                ایجاد شده: {formatDate(user.createdAt)}
                              </p>
                              <p className="text-sm text-gray-600">
                                انقضا: {formatDate(user.expiresAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right" dir="rtl">
                                <p className="text-sm">
                                  سهمیه: {user.maxUploadQuotaMb} مگابایت
                                </p>
                                <p className="text-sm">
                                  مصرف شده: {usedQuota.toFixed(1)} مگابایت
                                </p>
                                <p className="text-sm">
                                  تعداد فایل: {userFiles.length}
                                </p>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: "user",
                                    id: user.id,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {userFiles.length > 0 && (
                            <div className="mt-3 p-3 bg-white rounded border">
                              <p className="text-sm font-medium mb-2" dir="rtl">
                                فایل‌های این کاربر:
                              </p>
                              <div className="space-y-2">
                                {userFiles.map((file) => (
                                  <div
                                    key={file.id}
                                    className="flex justify-between items-center text-sm"
                                    dir="rtl"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">
                                        {getFileIcon(file.fileType)}
                                      </span>
                                      <span>{file.displayName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-500">
                                        {file.fileSizeMb.toFixed(1)} مگابایت
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDownload(file)}
                                      >
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {index < users.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle dir="rtl">تمام فایل‌ها ({files.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {files.map((file, index) => {
                    const fileUser = users.find((u) => u.id === file.userId);

                    return (
                      <div key={file.id}>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3" dir="rtl">
                            <div className="text-2xl">
                              {getFileIcon(file.fileType)}
                            </div>
                            <div>
                              <p className="font-medium">{file.displayName}</p>
                              <p className="text-sm text-gray-500">
                                {file.fileSizeMb.toFixed(1)} مگابایت •{" "}
                                {formatDate(file.uploadedAt)}
                              </p>
                              <p className="text-sm text-gray-500">
                                کاربر: {fileUser?.username || "نامشخص"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {file.originalName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(file)}
                            >
                              <Download className="h-4 w-4 ml-2" />
                              دانلود
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setDeleteConfirm({ type: "file", id: file.id })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {index < files.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" dir="rtl">
                  <UserPlus className="h-5 w-5" />
                  ایجاد کاربر موقت جدید
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newUsername">نام کاربری</Label>
                    <Input
                      id="newUsername"
                      value={newUserForm.username}
                      onChange={(e) =>
                        setNewUserForm((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      placeholder="نام کاربری را وارد کنید"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">رمز عبور</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newUserForm.password}
                      onChange={(e) =>
                        setNewUserForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="رمز عبور را وارد کنید"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quota">سهمیه آپلود (مگابایت)</Label>
                    <Input
                      id="quota"
                      type="number"
                      value={newUserForm.maxUploadQuotaMb}
                      onChange={(e) =>
                        setNewUserForm((prev) => ({
                          ...prev,
                          maxUploadQuotaMb: parseInt(e.target.value) || 0,
                        }))
                      }
                      min="1"
                      max="1000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiry">مدت اعتبار (ساعت)</Label>
                    <Input
                      id="expiry"
                      type="number"
                      value={newUserForm.expiresInHours}
                      onChange={(e) =>
                        setNewUserForm((prev) => ({
                          ...prev,
                          expiresInHours: parseInt(e.target.value) || 0,
                        }))
                      }
                      min="1"
                      max="168"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateUser}
                  disabled={!newUserForm.username || !newUserForm.password}
                  className="w-full md:w-auto"
                >
                  <UserPlus className="h-4 w-4 ml-2" />
                  ایجاد کاربر
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4" dir="rtl">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-medium text-red-800">
                  تأیید حذف {deleteConfirm.type === "user" ? "کاربر" : "فایل"}
                </h3>
              </div>
              <p className="text-red-700 mb-4" dir="rtl">
                {deleteConfirm.type === "user"
                  ? "آیا مطمئن هستید که می‌خواهید این کاربر و تمام فایل‌های آن را حذف کنید؟"
                  : "آیا مطمئن هستید که می‌خواهید این فایل را حذف کنید؟"}{" "}
                این عمل قابل برگشت نیست.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteConfirm(null)}
                >
                  انصراف
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (deleteConfirm.type === "user") {
                      handleDeleteUser(deleteConfirm.id);
                    } else {
                      handleDeleteFile(deleteConfirm.id);
                    }
                  }}
                >
                  حذف {deleteConfirm.type === "user" ? "کاربر" : "فایل"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
