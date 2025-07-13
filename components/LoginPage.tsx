import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Shield, User } from "lucide-react";
import { companyConfig } from "../config/company";

interface LoginPageProps {
  onUserLogin: (username: string, password: string) => void;
  onAdminLogin: (username: string, password: string) => void;
}

export function LoginPage({ onUserLogin, onAdminLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"user" | "admin">("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      if (loginType === "admin") {
        onAdminLogin(username, password);
      } else {
        onUserLogin(username, password);
      }
    } catch (err: any) {
      setError(err.message || "خطا در ورود به سیستم");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center pt-4"
      dir="rtl"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-lg flex items-center justify-center mb-4 shadow-lg">
            <img
              src={companyConfig.assets.logoIcon}
              alt={companyConfig.company.name}
              className="h-12 w-12 object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                const fallback = target.nextElementSibling as HTMLElement;
                target.style.display = "none";
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <Shield className="h-8 w-8 text-primary hidden" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {companyConfig.company.name}
          </h1>
          <p className="text-gray-600">{companyConfig.messages.loginMessage}</p>
        </div>

        {/* Login Type Selection */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={loginType === "user" ? "default" : "outline"}
            onClick={() => setLoginType("user")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            کاربر
          </Button>
          <Button
            variant={loginType === "admin" ? "default" : "outline"}
            onClick={() => setLoginType("admin")}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            مدیر
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              {loginType === "admin" ? (
                <>
                  <Shield className="h-6 w-6 text-primary" />
                  ورود مدیر
                </>
              ) : (
                <>
                  <User className="h-6 w-6 text-primary" />
                  ورود کاربر
                </>
              )}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {loginType === "admin"
                ? "برای دسترسی به پنل مدیریت وارد شوید"
                : "برای آپلود فایل نام کاربری و رمز عبور خود را وارد کنید"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  نام کاربری
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="نام کاربری خود را وارد کنید"
                  required
                  dir="rtl"
                  className="h-11 border-2 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  رمز عبور
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                  dir="rtl"
                  className="h-11 border-2 focus:border-primary"
                />
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="border-l-4 border-l-destructive"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "در حال ورود..." : "ورود"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
