export interface TemporaryAccount {
  id: string;
  username: string;
  password: string;
  maxUploadQuotaMb: number;
  expiresAt: Date | string;
  isActive: boolean;
  createdAt: Date | string;
}

export interface UploadedFile {
  id: string;
  fileName: string;
  displayName: string;
  fileSizeMb: number;
  uploadedAt: Date | string;
  userId: string;
  fileUrl: string;
  fileType: string;
  originalName: string;
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

export type RouteType = "login" | "user" | "admin";
