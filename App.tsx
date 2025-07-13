import React, { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { UserDashboard } from "./components/UserDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { Router, useRouter } from "./components/Router";
import { TemporaryAccount, RouteType } from "./types";
import { UserService } from "./services/userService";
import { FileService } from "./services/fileService";
import BackupService from "./services/backupService";

type UserSession = {
  user: TemporaryAccount | null;
  isAdmin: boolean;
} | null;

export default function App() {
  const [session, setSession] = useState<UserSession>(null);
  const [currentRoute, setCurrentRoute] = useState<RouteType>("login");

  useEffect(() => {
    // شروع سیستم بک‌آپ خودکار
    BackupService.startAutoBackup();

    // ایجاد اولین بک‌آپ
    BackupService.createBackup();

    // Handle browser navigation
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/admin")) {
        setCurrentRoute("admin");
      } else if (path.startsWith("/user")) {
        setCurrentRoute("user");
      } else {
        setCurrentRoute("login");
        setSession(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    handlePopState(); // Set initial route

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleUserLogin = (username: string, password: string) => {
    const user = UserService.authenticateUser(username, password);
    if (!user) {
      throw new Error(
        "نام کاربری یا رمز عبور اشتباه است یا حساب شما منقضی شده است"
      );
    }

    setSession({ user, isAdmin: false });
    setCurrentRoute("user");
    window.history.pushState({}, "", "/user");
  };

  const handleAdminLogin = (username: string, password: string) => {
    const isValidAdmin = UserService.authenticateAdmin(username, password);
    if (!isValidAdmin) {
      throw new Error("اطلاعات ورود مدیر اشتباه است");
    }

    setSession({ user: null, isAdmin: true });
    setCurrentRoute("admin");
    window.history.pushState({}, "", "/admin");
  };

  const handleLogout = () => {
    setSession(null);
    setCurrentRoute("login");
    window.history.pushState({}, "", "/");
  };

  return (
    <Router currentRoute={currentRoute}>
      {!session || currentRoute === "login" ? (
        <LoginPage
          onUserLogin={handleUserLogin}
          onAdminLogin={handleAdminLogin}
        />
      ) : session.isAdmin ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : session.user ? (
        <UserDashboard user={session.user} onLogout={handleLogout} />
      ) : (
        <LoginPage
          onUserLogin={handleUserLogin}
          onAdminLogin={handleAdminLogin}
        />
      )}
    </Router>
  );
}
