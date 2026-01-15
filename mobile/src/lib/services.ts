import { apiClient } from "./api";
// Use legacy API for compatibility with SDK 54
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as SecureStore from "expo-secure-store";
import {
  AuthResponse,
  RegisterInput,
  LoginInput,
  Farmer,
  UpdateStatusInput,
  FarmerStats,
} from "../types";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

export const authApi = {
  register: (data: RegisterInput) =>
    apiClient.post<AuthResponse>("/auth/register", data),

  login: (data: LoginInput) =>
    apiClient.post<AuthResponse>("/auth/login", data),
};

export const farmerApi = {
  getMyStatus: () =>
    apiClient.get<Farmer>("/farmers/me/status"),

  updateLocation: (farmerId: string, latitude: number, longitude: number) =>
    apiClient.patch<Farmer>(`/farmers/${farmerId}/location`, { latitude, longitude }),

  downloadCertificate: async (farmerId: string): Promise<boolean> => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const fileUri = `${FileSystem.documentDirectory}certificate_${farmerId}.pdf`;
      
      const downloadResult = await FileSystem.downloadAsync(
        `${API_URL}/farmers/${farmerId}/certificate`,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (downloadResult.status !== 200) {
        throw new Error("Failed to download certificate");
      }

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/pdf",
          dialogTitle: "Your FarmVerify Certificate",
        });
      }

      return true;
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  },
};

export const adminApi = {
  getAllFarmers: (status?: string, search?: string) =>
    apiClient.get<Farmer[]>("/admin/farmers", { status, search }),

  getFarmerById: (id: string) =>
    apiClient.get<Farmer>(`/admin/farmers/${id}`),

  updateFarmerStatus: (id: string, data: UpdateStatusInput) =>
    apiClient.patch<Farmer>(`/admin/farmers/${id}/status`, data),

  getStats: () =>
    apiClient.get<FarmerStats>("/admin/farmers/stats"),
};
