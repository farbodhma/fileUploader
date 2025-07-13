"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/components/LoginPage";
import { UserService } from "@/services/userService";
import { FileService } from "@/services/fileService";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Initialize services with mock data
    UserService.initializeWithMockData();
    FileService.initializeWithMockData();
  }, []);

  const handleUserLogin = (username: string, password: string) => {
    const user = UserService.authenticateUser(username, password);
    if (!user) {
      throw new Error(
        "نام کاربری یا رمز عبور اشتباه است یا حساب شما منقضی شده است"
      );
    }

    // Store user session
    sessionStorage.setItem("userAuth", JSON.stringify(user));
    router.push("/user");
  };

  const handleAdminLogin = (username: string, password: string) => {
    const isValidAdmin = UserService.authenticateAdmin(username, password);
    if (!isValidAdmin) {
      throw new Error("اطلاعات ورود مدیر اشتباه است");
    }

    // Store admin session
    sessionStorage.setItem("adminAuth", "true");
    router.push("/admin");
  };

  return (
    <LoginPage onUserLogin={handleUserLogin} onAdminLogin={handleAdminLogin} />
  );
}
