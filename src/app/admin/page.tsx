// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./_components/admin-header";
import DataManagementTab from "./_components/data-management-tab";
import OverviewTab from "./_components/overview-tab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "data">("overview");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Cek status login dan waktu login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const loginTime = localStorage.getItem("loginTime");
    
    if (isLoggedIn !== "true" || !loginTime) {
      // Redirect ke halaman login jika belum login atau tidak ada waktu login
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("loginTime");
      router.push("/admin/login");
      return;
    }

    // Cek apakah sudah 30 menit (1800000 ms)
    const currentTime = new Date().getTime();
    const timeElapsed = currentTime - parseInt(loginTime);
    const thirtyMinutes = 30 * 60 * 1000; // 30 menit dalam milidetik

    if (timeElapsed > thirtyMinutes) {
      // Session expired, hapus data dan redirect ke login
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("loginTime");
      router.push("/admin/login");
      return;
    }

    // Session masih valid, set timer untuk auto logout
    const timeRemaining = thirtyMinutes - timeElapsed;
    const logoutTimer = setTimeout(() => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("loginTime");
      router.push("/admin/login");
    }, timeRemaining);

    setIsLoading(false);

    // Cleanup timer
    return () => clearTimeout(logoutTimer);
  }, [router]);

  // User data dummy
  const userData = {
    name: "Administrator",
    email: "admin@lkpp.go.id",
    image: null
  };

  // Tampilkan loading spinner saat checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi autentikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminHeader 
        user={userData} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "overview" ? (
          <OverviewTab />
        ) : (
          <DataManagementTab />
        )}
      </div>
    </div>
  );
}