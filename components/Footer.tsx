import React from "react";
import { companyConfig } from "../config/company";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              {companyConfig.company.establishedYear}
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
              <p>📞 {companyConfig.contact.phone}</p>
              <p>📱 {companyConfig.contact.mobile}</p>
              <p>✉️ {companyConfig.contact.email}</p>
              <p>🌐 {companyConfig.contact.website}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} {companyConfig.company.name}. تمامی
              حقوق محفوظ است.
            </p>
            <p>{companyConfig.legal.supportContact}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
