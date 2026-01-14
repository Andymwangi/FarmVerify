"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Navbar } from "@/components/Navbar";
import { StatusCard } from "@/components/farmer/StatusCard";
import { LocationPicker } from "@/components/farmer/LocationPicker";
import { useAuth } from "@/hooks/useAuth";
import { useFarmerStatus } from "@/hooks/useFarmers";
import { farmerApi } from "@/lib/services";

export default function FarmerDashboard() {
  const { user, loading: authLoading, isAuthenticated, isFarmer } = useAuth();
  const { farmer, loading, error, refetch } = useFarmerStatus();
  const router = useRouter();
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleLocationUpdate = async (latitude: number, longitude: number) => {
    if (!farmer) return;
    
    try {
      await farmerApi.updateLocation(farmer.id, latitude, longitude);
      await refetch();
      setShowLocationModal(false);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isFarmer)) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, isFarmer, router]);

  if (authLoading || loading) {
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

  if (error || !farmer) {
    return (
      <div className="min-h-screen bg-green-50 dark:bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-md text-center">
            <Icon icon="solar:danger-triangle-bold" className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 text-2xl font-bold">Error Loading Data</h1>
            <p className="mt-2 text-muted-foreground">{error || "Failed to load farmer data"}</p>
            <button
              onClick={refetch}
              className="mt-4 text-primary hover:underline"
            >
              Try again
            </button>
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
          <h1 className="text-3xl font-bold">Welcome, {farmer.name}</h1>
          <p className="text-muted-foreground">View your certification status and farm details</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <StatusCard farmer={farmer} />
          
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={async () => {
                    if (farmer.certificationStatus !== "CERTIFIED") {
                      alert("Certificate is only available after certification.");
                      return;
                    }
                    try {
                      const { farmerApi } = await import("@/lib/services");
                      const blob = await farmerApi.downloadCertificate(farmer.id);
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `Certificate-${farmer.id.substring(0, 8)}.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    } catch (error) {
                      console.error("Failed to download certificate", error);
                      alert("Failed to download certificate. Please try again.");
                    }
                  }}
                  disabled={farmer.certificationStatus !== "CERTIFIED"}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                    farmer.certificationStatus === "CERTIFIED"
                      ? "hover:bg-muted cursor-pointer"
                      : "opacity-50 cursor-not-allowed bg-muted/50"
                  }`}
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon icon="solar:document-bold" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">View Certificate</p>
                    <p className="text-xs text-muted-foreground">Download PDF</p>
                  </div>
                </button>
                <button 
                  onClick={() => setShowLocationModal(true)}
                  className="flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted"
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon icon="solar:map-point-bold" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Update Location</p>
                    <p className="text-xs text-muted-foreground">
                      {farmer.latitude && farmer.longitude ? "Update GPS" : "Add GPS coordinates"}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Need Help?</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                If you have any questions about your certification status or need assistance, 
                please contact our support team.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="solar:phone-bold" className="h-4 w-4 text-primary" />
                <span>+254 700 123 456</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative max-w-md w-full">
              <button
                onClick={() => setShowLocationModal(false)}
                className="absolute -top-2 -right-2 z-10 rounded-full bg-background p-2 shadow-lg hover:bg-muted"
              >
                <Icon icon="solar:close-circle-bold" className="h-6 w-6" />
              </button>
              <LocationPicker
                onLocationUpdate={handleLocationUpdate}
                currentLatitude={farmer.latitude}
                currentLongitude={farmer.longitude}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
