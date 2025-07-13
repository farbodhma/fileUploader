import React from "react";
import { companyConfig } from "../config/company";

interface FontWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function FontWrapper({ children, className = "" }: FontWrapperProps) {
  const fontFamily = `"${companyConfig.assets.primaryFont}", ${companyConfig.assets.fallbackFonts.map((f) => `"${f}"`).join(", ")}`;

  return (
    <div
      className={className}
      style={{
        fontFamily,
        direction: "rtl",
        textAlign: "right",
      }}
    >
      {children}
    </div>
  );
}

// Hook برای استفاده آسان فونت
export function usePersianFont() {
  return `"${companyConfig.assets.primaryFont}", ${companyConfig.assets.fallbackFonts.map((f) => `"${f}"`).join(", ")}`;
}
