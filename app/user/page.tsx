"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserDashboard } from "@/components/UserDashboard";
import { UserService } from "@/services/userService";
import { TemporaryAccount } from "@/types";

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<TemporaryAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated (you can implement proper session management here)
    const userAuth = sessionStorage.getItem("userAuth");
    if (!userAuth) {
      router.push("/");
      return;
    }

    try {
      const userData = JSON.parse(userAuth);
      setUser(userData);
    } catch {
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("userAuth");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to home
  }

  return <UserDashboard user={user} onLogout={handleLogout} />;
}
