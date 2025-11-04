// app/admin/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminHeader from "./_components/admin-header";
import DataManagementTab from "./_components/data-management-tab";
import OverviewTab from "./_components/overview-tab";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "data">("overview");

  // Redirect ke login jika belum authenticated
  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminHeader 
        user={session.user} 
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