"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/containers/AdminSidebar";
import Navbar from "@/app/components/containers/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="h-screen bg-[#F3F4F6] flex overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {/* 
        Main Content Wrapper 
        - We apply lg:pl-20 because the sidebar is fixed and takes up 5rem (20 * 4px) in its collapsed state on desktop.
        - When expanded, it floats over the content, so we don't increase padding.
      */}
      <div className="flex flex-col flex-1 overflow-hidden lg:pl-20 transition-all duration-300">
        <Navbar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
