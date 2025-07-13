import { UploadedFile } from '../types';

export class FileService {
  private static readonly STORAGE_KEY = 'uploaded_files';
  private static readonly FILES_STORAGE_KEY = 'file_data_';

  static async uploadFile(file: File, displayName: string, userId: string): Promise<UploadedFile> {
    const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${fileId}_${file.name}`;
    
    // Convert file to base64 for storage
    const fileData = await this.fileToBase64(file);
    
    // Store file data
    localStorage.setItem(this.FILES_STORAGE_KEY + fileId, fileData);
    
    const uploadedFile: UploadedFile = {
      id: fileId,
      fileName,
      displayName,
      fileSizeMb: file.size / (1024 * 1024),
      uploadedAt: new Date(),
      userId,
      fileUrl: `stored:${fileId}`,
      fileType: file.type,
      originalName: file.name
    };

    // Save file metadata
    const existingFiles = this.getAllFiles();
    existingFiles.push(uploadedFile);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingFiles));

    return uploadedFile;
  }

  static deleteFile(fileId: string): void {
    // Remove file data
    localStorage.removeItem(this.FILES_STORAGE_KEY + fileId);
    
    // Remove from files list
    const existingFiles = this.getAllFiles();
    const updatedFiles = existingFiles.filter(f => f.id !== fileId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFiles));
  }

  static getAllFiles(): UploadedFile[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored).map((file: any) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt)
      }));
    } catch {
      return [];
    }
  }

  static getFilesByUserId(userId: string): UploadedFile[] {
    return this.getAllFiles().filter(file => file.userId === userId);
  }

  static async downloadFile(fileId: string): Promise<Blob | null> {
    const fileData = localStorage.getItem(this.FILES_STORAGE_KEY + fileId);
    if (!fileData) return null;

    try {
      const response = await fetch(fileData);
      return response.blob();
    } catch {
      return null;
    }
  }

  static getFileUrl(fileId: string): string | null {
    const fileData = localStorage.getItem(this.FILES_STORAGE_KEY + fileId);
    return fileData || null;
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  static initializeWithMockData(): void {
    if (localStorage.getItem(this.STORAGE_KEY)) return;
    
    // Initialize with empty array
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
  }
}