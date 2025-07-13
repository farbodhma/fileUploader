import { TemporaryAccount } from '../types';

export class UserService {
  private static readonly STORAGE_KEY = 'temporary_accounts';
  private static readonly ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

  static createUser(userData: Omit<TemporaryAccount, 'id' | 'createdAt'>): TemporaryAccount {
    const newUser: TemporaryAccount = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const existingUsers = this.getAllUsers();
    existingUsers.push(newUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingUsers));

    return newUser;
  }

  static getAllUsers(): TemporaryAccount[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored).map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        expiresAt: new Date(user.expiresAt)
      }));
    } catch {
      return [];
    }
  }

  static getUserById(id: string): TemporaryAccount | null {
    const users = this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  static authenticateUser(username: string, password: string): TemporaryAccount | null {
    const users = this.getAllUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) return null;
    if (!user.isActive) return null;
    if (user.expiresAt.getTime() < Date.now()) return null;
    
    return user;
  }

  static authenticateAdmin(username: string, password: string): boolean {
    return username === this.ADMIN_CREDENTIALS.username && 
           password === this.ADMIN_CREDENTIALS.password;
  }

  static updateUser(id: string, updates: Partial<TemporaryAccount>): TemporaryAccount | null {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    
    return users[userIndex];
  }

  static deleteUser(id: string): void {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredUsers));
  }

  static initializeWithMockData(): void {
    if (localStorage.getItem(this.STORAGE_KEY)) return;
    
    const mockUsers: TemporaryAccount[] = [
      {
        id: '1',
        username: 'user1',
        password: 'pass123',
        maxUploadQuotaMb: 100,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        username: 'user2',
        password: 'pass456',
        maxUploadQuotaMb: 50,
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ];
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockUsers));
  }
}