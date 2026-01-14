import { UserRole, CertificationStatus } from "@prisma/client";

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface RegisterFarmerInput {
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

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export { UserRole, CertificationStatus };
