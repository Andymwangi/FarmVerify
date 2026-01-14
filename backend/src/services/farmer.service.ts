import prisma from "../config/database";
import { CertificationStatus, UpdateStatusInput } from "../types";

export const getFarmerByUserId = async (userId: string) => {
  const farmer = await prisma.farmer.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          email: true,
          createdAt: true,
        },
      },
    },
  });

  if (!farmer) {
    throw new Error("Farmer not found");
  }

  return farmer;
};

export const getAllFarmers = async (
  status?: CertificationStatus,
  search?: string
) => {
  const where: Record<string, unknown> = {};

  if (status) {
    where.certificationStatus = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const farmers = await prisma.farmer.findMany({
    where,
    include: {
      user: {
        select: {
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return farmers;
};

export const getFarmerById = async (id: string) => {
  const farmer = await prisma.farmer.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          email: true,
          createdAt: true,
        },
      },
    },
  });

  if (!farmer) {
    throw new Error("Farmer not found");
  }

  return farmer;
};

export const updateFarmerStatus = async (
  farmerId: string,
  adminId: string,
  data: UpdateStatusInput
) => {
  const farmer = await prisma.farmer.findUnique({
    where: { id: farmerId },
  });

  if (!farmer) {
    throw new Error("Farmer not found");
  }

  const updateData: Record<string, unknown> = {
    certificationStatus: data.status,
  };

  if (data.status === "CERTIFIED") {
    updateData.certifiedAt = new Date();
    updateData.certifiedBy = adminId;
    updateData.declinedAt = null;
    updateData.declinedBy = null;
    updateData.declineReason = null;
  } else if (data.status === "DECLINED") {
    updateData.declinedAt = new Date();
    updateData.declinedBy = adminId;
    updateData.declineReason = data.reason || null;
    updateData.certifiedAt = null;
    updateData.certifiedBy = null;
  }

  const updatedFarmer = await prisma.farmer.update({
    where: { id: farmerId },
    data: updateData,
    include: {
      user: {
        select: {
          email: true,
          createdAt: true,
        },
      },
    },
  });

  return updatedFarmer;
};

export const getFarmerStats = async () => {
  const [total, pending, certified, declined] = await Promise.all([
    prisma.farmer.count(),
    prisma.farmer.count({ where: { certificationStatus: "PENDING" } }),
    prisma.farmer.count({ where: { certificationStatus: "CERTIFIED" } }),
    prisma.farmer.count({ where: { certificationStatus: "DECLINED" } }),
  ]);

  return { total, pending, certified, declined };
};
