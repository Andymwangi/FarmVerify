"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/Input";
import { Farmer, CertificationStatus } from "@/types";
import { format } from "date-fns";

interface FarmerListProps {
  farmers: Farmer[];
  onStatusChange: (farmerId: string, status: CertificationStatus, reason?: string) => Promise<void>;
  loading?: boolean;
}

export function FarmerList({ farmers, onStatusChange, loading }: FarmerListProps) {
  const [filter, setFilter] = useState<CertificationStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState<string | null>(null);

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesFilter = filter === "ALL" || farmer.certificationStatus === filter;
    const matchesSearch =
      search === "" ||
      farmer.name.toLowerCase().includes(search.toLowerCase()) ||
      farmer.user?.email.toLowerCase().includes(search.toLowerCase()) ||
      farmer.cropType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAction = async (farmerId: string, status: CertificationStatus, reason?: string) => {
    setProcessingId(farmerId);
    try {
      await onStatusChange(farmerId, status, reason);
      setShowDeclineModal(null);
      setDeclineReason("");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Icon icon="solar:refresh-bold" className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading farmers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["ALL", "PENDING", "CERTIFIED", "DECLINED"] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search farmers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredFarmers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icon icon="solar:user-cross-bold" className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No farmers found</p>
            <p className="text-sm text-muted-foreground">
              {search ? "Try a different search term" : "No farmers match the current filter"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredFarmers.map((farmer) => (
            <Card key={farmer.id} className="relative overflow-hidden">
              <div className={`absolute left-0 top-0 h-full w-1 ${farmer.certificationStatus === "CERTIFIED" ? "bg-primary" : farmer.certificationStatus === "DECLINED" ? "bg-destructive" : "bg-warning"}`} />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{farmer.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{farmer.user?.email}</p>
                  </div>
                  <StatusBadge status={farmer.certificationStatus} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Farm Size</p>
                    <p className="font-medium">{farmer.farmSize} acres</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Crop Type</p>
                    <p className="font-medium">{farmer.cropType}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Registered</p>
                    <p className="font-medium">
                      {format(new Date(farmer.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                {farmer.certificationStatus === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAction(farmer.id, "CERTIFIED")}
                      disabled={processingId === farmer.id}
                    >
                      <Icon icon="solar:check-circle-bold" className="mr-1 h-4 w-4" />
                      Certify
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => setShowDeclineModal(farmer.id)}
                      disabled={processingId === farmer.id}
                    >
                      <Icon icon="solar:close-circle-bold" className="mr-1 h-4 w-4" />
                      Decline
                    </Button>
                  </div>
                )}

                {farmer.certificationStatus === "DECLINED" && farmer.declineReason && (
                  <div className="rounded-lg bg-destructive/5 p-3 text-sm">
                    <p className="font-medium text-destructive">Reason:</p>
                    <p className="text-muted-foreground">{farmer.declineReason}</p>
                  </div>
                )}
              </CardContent>

              {showDeclineModal === farmer.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm">
                  <div className="w-full max-w-xs space-y-4">
                    <h3 className="font-semibold">Decline Application</h3>
                    <Input
                      placeholder="Reason for decline (optional)"
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleAction(farmer.id, "DECLINED", declineReason)}
                        disabled={processingId === farmer.id}
                        isLoading={processingId === farmer.id}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowDeclineModal(null);
                          setDeclineReason("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
