import { TemporaryAccount } from "../types";

export class UserService {
  private static readonly STORAGE_KEY = "temporary_accounts";

  // دریافت اطلاعات ادمین از متغیرهای محیط یا مقادیر پیش‌فرض
  private static getAdminCredentials() {
    return [
      {
        username: process.env.ADMIN_USERNAME_1,
        password: process.env.ADMIN_PASSWORD_1,
      },
    ];
  }

  static createUser(
    userData: Omit<TemporaryAccount, "id" | "createdAt">
  ): TemporaryAccount {
    const newUser: TemporaryAccount = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
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
        expiresAt: new Date(user.expiresAt),
      }));
    } catch {
      return [];
    }
  }

  static getUserById(id: string): TemporaryAccount | null {
    const users = this.getAllUsers();
    return users.find((user) => user.id === id) || null;
  }

  static authenticateUser(
    username: string,
    password: string
  ): TemporaryAccount | null {
    const users = this.getAllUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) return null;
    if (!user.isActive) return null;

    // اطمینان از اینکه expiresAt یک Date object است
    const expiresAt =
      user.expiresAt instanceof Date
        ? user.expiresAt
        : new Date(user.expiresAt);
    if (expiresAt.getTime() < Date.now()) return null;

    return user;
  }

  static authenticateAdmin(username: string, password: string): boolean {
    const adminCredentials = this.getAdminCredentials();
    return adminCredentials.some(
      (admin) => admin.username === username && admin.password === password
    );
  }

  static updateUser(
    id: string,
    updates: Partial<TemporaryAccount>
  ): TemporaryAccount | null {
    const users = this.getAllUsers();
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

    return users[userIndex];
  }

  static deleteUser(id: string): void {
    const users = this.getAllUsers();
    const filteredUsers = users.filter((u) => u.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredUsers));
  }
}
