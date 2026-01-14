"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Navbar } from "@/components/Navbar";
import { FarmerList } from "@/components/admin/FarmerList";
import { StatsCards } from "@/components/admin/CertificationActions";
import { useAuth } from "@/hooks/useAuth";
import { useFarmers } from "@/hooks/useFarmers";
import { CertificationStatus } from "@/types";

export default function AdminDashboard() {
  const { user, loading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { farmers, stats, loading, updateStatus } = useFarmers();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const handleStatusChange = async (
    farmerId: string,
    status: CertificationStatus,
    reason?: string
  ) => {
    await updateStatus(farmerId, { status, reason });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-green-50 dark:bg-background">
        <Navbar />
        <div className="container mx-auto flex items-center justify-center px-4 py-24">
          <div className="flex flex-col items-center gap-4">
            <Icon icon="solar:refresh-bold" className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 dark:bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage farmer certifications and review applications
          </p>
        </div>

        <div className="mb-8">
          <StatsCards stats={stats} />
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-6 text-xl font-semibold">Farmer Applications</h2>
          <FarmerList
            farmers={farmers}
            onStatusChange={handleStatusChange}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}
