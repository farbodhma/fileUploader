import React from "react";
import { companyConfig } from "../config/company";

// تابع تبدیل اعداد انگلیسی به فارسی
const toPersianNumbers = (str: string | number) => {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str
    .toString()
    .replace(/[0-9]/g, (digit) => persianNumbers[parseInt(digit)]);
};

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12" dir="rtl">
      <div className="flex flex-col px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={companyConfig.assets.logoWhite}
                alt={companyConfig.company.name}
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <h3 className="text-lg font-bold">
                {companyConfig.company.name}
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              {companyConfig.company.type} تاسیس{" "}
              {toPersianNumbers(companyConfig.company.establishedYear)}
            </p>
            <p className="text-gray-400 text-xs">
              {companyConfig.legal.privacyPolicy}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold">اطلاعات تماس</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 {companyConfig.contact.address}</p>
              <p>📞 {toPersianNumbers(companyConfig.contact.phone)}</p>
              <p>📱 {toPersianNumbers(companyConfig.contact.mobile)}</p>
              <p>✉️ {companyConfig.contact.email}</p>
              <p>🌐 {companyConfig.contact.website}</p>
            </div>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold">پشتیبانی و قوانین</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>{companyConfig.legal.supportContact}</p>
              <p className="text-xs text-gray-400">
                {companyConfig.legal.termsOfUse}
              </p>
              <p className="text-xs text-gray-400">
                {companyConfig.legal.dataRetention}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              © {toPersianNumbers(new Date().getFullYear())}{" "}
              {companyConfig.company.name}. تمامی حقوق محفوظ است.
            </p>
            <p>{companyConfig.legal.supportContact}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
