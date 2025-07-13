import { TemporaryAccount, UploadedFile } from "../types";

export const mockUsers: TemporaryAccount[] = [
  {
    id: "1",
    username: "user1",
    password: "pass123",
    maxUploadQuotaMb: 100,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    username: "user2",
    password: "pass456",
    maxUploadQuotaMb: 50,
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    isActive: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "3",
    username: "expired_user",
    password: "pass789",
    maxUploadQuotaMb: 75,
    expiresAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago (expired)
    isActive: false,
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
  },
];

export const mockFiles: UploadedFile[] = [
  {
    id: "1",
    fileName: "document_uuid1.pdf",
    displayName: "گزارش پروژه.pdf",
    fileSizeMb: 2.5,
    uploadedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    userId: "1",
    fileUrl: "/mock-files/document_uuid1.pdf",
    fileType: "application/pdf",
    originalName: "گزارش پروژه.pdf",
  },
  {
    id: "2",
    fileName: "image_uuid2.jpg",
    displayName: "عکس تیم.jpg",
    fileSizeMb: 1.2,
    uploadedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    userId: "1",
    fileUrl: "/mock-files/image_uuid2.jpg",
    fileType: "image/jpeg",
    originalName: "عکس تیم.jpg",
  },
  {
    id: "3",
    fileName: "spreadsheet_uuid3.xlsx",
    displayName: "جدول داده‌ها.xlsx",
    fileSizeMb: 0.8,
    uploadedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    userId: "2",
    fileUrl: "/mock-files/spreadsheet_uuid3.xlsx",
    fileType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    originalName: "جدول داده‌ها.xlsx",
  },
];

// Admin credentials
export const adminCredentials = {
  username: "admin",
  password: "admin123",
};
