import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { FileService } from "../services/fileService";

interface FileUploadProps {
  userId: string;
  onUpload: () => void;
  maxSizeMb: number;
  remainingQuotaMb: number;
}

export function FileUpload({
  userId,
  onUpload,
  maxSizeMb,
  remainingQuotaMb,
}: FileUploadProps) {
  const [displayName, setDisplayName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    setError("");
    setSuccess("");

    // Validate file size
    const fileSizeMb = file.size / (1024 * 1024);
    if (fileSizeMb > remainingQuotaMb) {
      setError(
        `حجم فایل (${fileSizeMb.toFixed(1)} مگابایت) از سهمیه باقی‌مانده (${remainingQuotaMb.toFixed(1)} مگابایت) بیشتر است.`
      );
      setSelectedFile(null);
      return;
    }

    if (fileSizeMb > maxSizeMb) {
      setError(`حجم فایل نباید از ${maxSizeMb} مگابایت بیشتر باشد.`);
      setSelectedFile(null);
      return;
    }

    // فایل انتخاب شد، منتظر کلیک دکمه آپلود
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("لطفاً ابتدا فایل را انتخاب کنید.");
      return;
    }

    if (!displayName.trim()) {
      setError("لطفاً نام نمایشی فایل را وارد کنید.");
      return;
    }

    setIsUploading(true);
    try {
      await FileService.uploadFile(selectedFile, displayName.trim(), userId);
      setSuccess("فایل با موفقیت آپلود شد.");
      setDisplayName("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUpload();
    } catch (err) {
      setError("خطا در آپلود فایل. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsUploading(false);
    }
  };

  const acceptedFileTypes =
    ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mp3,.wav,.zip,.rar";

  return (
    <Card className="shadow-lg border-0 bg-white/95 backdrop-blur" dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5 text-primary" />
          آپلود فایل جدید
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">
              نام نمایشی فایل
            </Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="نام نمایشی فایل را وارد کنید"
              dir="rtl"
              className="h-10 border-2 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileInput" className="text-sm font-medium">
              انتخاب فایل
            </Label>
            <Input
              ref={fileInputRef}
              id="fileInput"
              type="file"
              onChange={handleFileSelect}
              disabled={isUploading}
              accept={acceptedFileTypes}
              className="h-10 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
        </div>

        {/* نمایش فایل انتخاب شده */}
        {selectedFile && (
          <div
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            dir="rtl"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">📁</div>
              <div className="flex-1">
                <p className="font-medium text-blue-800">فایل انتخاب شده:</p>
                <p className="text-sm text-blue-600">{selectedFile.name}</p>
                <p className="text-xs text-blue-500">
                  حجم: {(selectedFile.size / (1024 * 1024)).toFixed(2)} مگابایت
                </p>
              </div>
            </div>
          </div>
        )}

        <div
          className="grid gap-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg"
          dir="rtl"
        >
          <div className="flex items-center justify-between">
            <span>حداکثر حجم فایل:</span>
            <span className="font-medium">{maxSizeMb} مگابایت</span>
          </div>
          <div className="flex items-center justify-between">
            <span>سهمیه باقی‌مانده:</span>
            <span className="font-medium text-primary">
              {remainingQuotaMb.toFixed(1)} مگابایت
            </span>
          </div>
          <div className="text-xs pt-2 border-t border-border">
            <span>
              فرمت‌های مجاز: PDF, DOC, XLS, PPT, TXT, عکس، ویدیو، صوت، فایل
              فشرده
            </span>
          </div>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="border-l-4 border-l-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-l-4 border-l-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {!selectedFile && !isUploading && (
          <div className="text-center text-muted-foreground py-4" dir="rtl">
            <p className="text-sm">
              ابتدا نام فایل را وارد کنید، سپس فایل را انتخاب کرده و دکمه آپلود
              را بزنید
            </p>
          </div>
        )}

        {isUploading && (
          <div
            className="flex items-center justify-center gap-3 py-4 text-primary"
            dir="rtl"
          >
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="font-medium">در حال آپلود فایل...</span>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !displayName.trim() || isUploading}
            size="lg"
            className="w-full max-w-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                در حال آپلود...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 ml-2" />
                آپلود فایل
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
