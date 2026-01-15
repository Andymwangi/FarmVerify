export interface User {
  id: string;
  email: string;
  role: "FARMER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  farmer?: Farmer;
  admin?: Admin;
}

export interface Farmer {
  id: string;
  userId: string;
  name: string;
  farmSize: number;
  cropType: string;
  certificationStatus: CertificationStatus;
  latitude?: number;
  longitude?: number;
  locationAddress?: string;
  certifiedAt?: string;
  certifiedBy?: string;
  declinedAt?: string;
  declinedBy?: string;
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    createdAt: string;
  };
}

export interface Admin {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type CertificationStatus = "PENDING" | "CERTIFIED" | "DECLINED";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  farmSize: number;
  cropType: string;
  latitude?: number;
  longitude?: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateStatusInput {
  status: CertificationStatus;
  reason?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface FarmerStats {
  total: number;
  pending: number;
  certified: number;
  declined: number;
}
