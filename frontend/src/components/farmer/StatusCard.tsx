"use client";

import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Farmer } from "@/types";
import { format } from "date-fns";

interface StatusCardProps {
  farmer: Farmer;
}

export function StatusCard({ farmer }: StatusCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${farmer.certificationStatus === "CERTIFIED" ? "bg-primary" : farmer.certificationStatus === "DECLINED" ? "bg-destructive" : "bg-warning"}`} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Certification Status</CardTitle>
          <StatusBadge status={farmer.certificationStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon icon="solar:user-bold" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{farmer.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon icon="solar:leaf-bold" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Crop Type</p>
              <p className="font-medium">{farmer.cropType}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon icon="solar:ruler-bold" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Farm Size</p>
              <p className="font-medium">{farmer.farmSize} acres</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon icon="solar:calendar-bold" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registered</p>
              <p className="font-medium">
                {format(new Date(farmer.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        {farmer.latitude && farmer.longitude && (
          <div className="rounded-lg bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon icon="solar:map-point-bold" className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-primary">Farm Location</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Coordinates: {farmer.latitude.toFixed(6)}, {farmer.longitude.toFixed(6)}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${farmer.latitude},${farmer.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1"
                >
                  View on Map
                  <Icon icon="solar:map-arrow-right-bold" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {farmer.certifiedAt && (
          <div className="rounded-lg bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-primary">
              <Icon icon="solar:verified-check-bold" className="h-5 w-5" />
              <span className="font-medium">
                Certified on {format(new Date(farmer.certifiedAt), "MMMM d, yyyy")}
              </span>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={async () => {
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
                variant="outline" 
                className="w-full gap-2 border-primary/20 bg-white hover:bg-primary/5 dark:bg-transparent"
              >
                <Icon icon="solar:file-download-bold" className="h-5 w-5" />
                Download Official Certificate
              </Button>
            </div>
          </div>
        )}

        {farmer.declinedAt && farmer.declineReason && (
          <div className="rounded-lg bg-destructive/5 p-4">
            <div className="flex items-start gap-2 text-destructive">
              <Icon icon="solar:info-circle-bold" className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-medium">
                  Declined on {format(new Date(farmer.declinedAt), "MMMM d, yyyy")}
                </p>
                <p className="text-sm opacity-80">Reason: {farmer.declineReason}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
