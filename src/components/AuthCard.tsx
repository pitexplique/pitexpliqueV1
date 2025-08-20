"use client";
import React from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        {/* Header style Dyma */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded bg-blue-600" />
          <span className="text-xl font-bold">Pitexplique</span>
        </div>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        {children}
      </div>
    </main>
  );
}
