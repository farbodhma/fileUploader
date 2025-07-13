"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { UserService } from "@/services/userService";
import { FileService } from "@/services/fileService";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize services
    UserService.initializeWithMockData();
    FileService.initializeWithMockData();

    // Check if admin is authenticated (you can implement proper session management here)
    // For now, we'll redirect to home for authentication
    const adminAuth = sessionStorage.getItem("adminAuth");
    if (!adminAuth) {
      router.push("/");
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to home
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
