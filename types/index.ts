export interface TemporaryAccount {
  id: string;
  username: string;
  password: string;
  maxUploadQuotaMb: number;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface UploadedFile {
  id: string;
  fileName: string;
  displayName: string;
  fileSizeMb: number;
  uploadedAt: Date;
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

export type RouteType = 'login' | 'user' | 'admin';