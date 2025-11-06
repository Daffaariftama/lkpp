// app/admin/_components/admin-header.tsx
"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Plus, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Hapus data login dari localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    // Redirect ke halaman login
    router.push("/admin/login");
  };

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
              <div className="hidden sm:block">
                <p className="text-xs text-slate-600 sm:text-sm lg:text-base">
                  Kelola data konsultasi dengan mudah
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-4 lg:flex">
              
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:to-cyan-600"
                size="sm"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">Form Baru</span>
                </Link>
              </Button>

              {/* User Menu Desktop */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="border-slate-300 hover:bg-slate-50"
                >
                  <User className="h-4 w-4" />
                </Button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                    <div className="px-4 py-2 text-sm text-slate-600 border-b border-slate-100">
                      <p className="font-medium">{user?.name ?? "Administrator"}</p>
                      <p className="text-xs">{user?.email ?? "admin@lkpp.go.id"}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:to-cyan-600"
                size="sm"
              >
                <Link href="/" className="flex items-center gap-1">
                  <Plus className="h-3 w-3" />
                  <span className="text-xs">Form</span>
                </Link>
              </Button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg border border-slate-300 p-2 hover:bg-slate-50"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="border-t border-slate-200 py-4 lg:hidden">
              <div className="space-y-4">
                {/* User Info Mobile */}
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {user?.name ?? "Administrator"}
                    </p>
                    <p className="text-xs text-slate-600">
                      {user?.email ?? "admin@lkpp.go.id"}
                    </p>
                  </div>
                </div>

                {/* Logout Button Mobile */}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex w-fit space-x-1 rounded-2xl border border-slate-200 bg-white/80 p-1 backdrop-blur-sm">
          <button
            onClick={() => onTabChange("overview")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 sm:px-6 sm:py-3 ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onTabChange("data")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 sm:px-6 sm:py-3 ${
              activeTab === "data"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            Data Management
          </button>
        </div>
      </div>

      {/* Overlay untuk menutup menu */}
      {(isMobileMenuOpen || isUserMenuOpen) && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </>
  );
}