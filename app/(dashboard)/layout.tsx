import Sidebar from "@/components/sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="ml-64 min-h-screen py-4">
      <Sidebar />
      {children}
    </main>
  );
}
