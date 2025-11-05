// app/admin/page.tsx
"use client";

import { useState } from "react";
import AdminHeader from "./_components/admin-header";
import DataManagementTab from "./_components/data-management-tab";
import OverviewTab from "./_components/overview-tab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "data">("overview");

  // User data dummy (bisa diganti dengan data sesuai kebutuhan)
  const userData = {
    name: "Administrator",
    email: "admin@lkpp.go.id",
    image: null
  };

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