import { apiClient } from "./api";
import {
  AuthResponse,
  RegisterInput,
  LoginInput,
  Farmer,
  UpdateStatusInput,
  FarmerStats,
} from "@/types";

export const authApi = {
  register: (data: RegisterInput) => 
    apiClient.post<AuthResponse>("/auth/register", data),

  login: (data: LoginInput) => 
    apiClient.post<AuthResponse>("/auth/login", data),
};

export const farmerApi = {
  getMyStatus: () => 
    apiClient.get<Farmer>("/farmers/me/status"),
  
  downloadCertificate: (id: string) =>
    apiClient.getBlob(`/farmers/${id}/certificate`),
  
  updateLocation: (id: string, latitude: number, longitude: number) =>
    apiClient.patch<Farmer>(`/farmers/${id}/location`, { latitude, longitude }),
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
