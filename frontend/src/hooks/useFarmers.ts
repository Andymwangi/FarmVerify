"use client";

import { useState, useEffect, useCallback } from "react";
import { Farmer, CertificationStatus, FarmerStats, UpdateStatusInput } from "@/types";
import { adminApi, farmerApi } from "@/lib/services";

export const useFarmers = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [stats, setStats] = useState<FarmerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFarmers = useCallback(async (status?: CertificationStatus, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getAllFarmers(status, search);
      if (response.success && response.data) {
        setFarmers(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch farmers");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await adminApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  const updateStatus = useCallback(async (farmerId: string, data: UpdateStatusInput) => {
    try {
      const response = await adminApi.updateFarmerStatus(farmerId, data);
      if (response.success && response.data) {
        setFarmers((prev) =>
          prev.map((f) => (f.id === farmerId ? response.data! : f))
        );
        await fetchStats();
        return response.data;
      }
      throw new Error("Failed to update status");
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to update status");
    }
  }, [fetchStats]);

  useEffect(() => {
    fetchFarmers();
    fetchStats();
  }, [fetchFarmers, fetchStats]);

  return {
    farmers,
    stats,
    loading,
    error,
    fetchFarmers,
    fetchStats,
    updateStatus,
    refetch: () => {
      fetchFarmers();
      fetchStats();
    },
  };
};

export const useFarmerStatus = () => {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await farmerApi.getMyStatus();
      if (response.success && response.data) {
        setFarmer(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    farmer,
    loading,
    error,
    refetch: fetchStatus,
  };
};
