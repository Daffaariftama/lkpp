// app/admin/_components/admin-header.tsx
"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  activeTab: "overview" | "data";
  onTabChange: (tab: "overview" | "data") => void;
}

export default function AdminHeader({ user, activeTab, onTabChange }: AdminHeaderProps) {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo dan Deskripsi - Susunan Vertikal */}
            <div className="flex flex-col items-start gap-1 space-y-1.5">
              <div className="flex-shrink-0">
                <Link href="/">
                  <img
                    src="/logo-lkpp.svg"
                    className="h-auto w-24 sm:w-32 lg:w-42"
                    alt="LKPP Logo"
                  />
                </Link>
              </div>
              <div>
                <p className="text-xs text-slate-600 sm:text-sm lg:text-base">
                  Kelola data konsultasi dengan mudah
                </p>
              </div>
            </div>

            {/* User Info dan Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-800">
                  {user?.name ?? "Administrator"}
                </p>
                <p className="text-xs text-slate-600">
                  {user?.email ?? "admin@lkpp.go.id"}
                </p>
              </div>
              
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:to-cyan-600"
                size="sm"
              >
                <Link href="/" className="flex items-center gap-1 sm:gap-2">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Form Baru</span>
                </Link>
              </Button>

              {/* Tombol Keluar dihapus */}
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex w-fit space-x-1 rounded-2xl border border-slate-200 bg-white/80 p-1 backdrop-blur-sm">
          <button
            onClick={() => onTabChange("overview")}
            className={`rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onTabChange("data")}
            className={`rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === "data"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            Data Management
          </button>
        </div>
      </div>
    </>
  );
}