import bcrypt from "bcryptjs";
import prisma from "../config/database";
import { generateToken } from "./token.service";
import { RegisterFarmerInput, LoginInput } from "../types";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const registerFarmer = async (data: RegisterFarmerInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: "FARMER",
      farmer: {
        create: {
          name: data.name,
          farmSize: data.farmSize,
          cropType: data.cropType,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      },
    },
    include: { farmer: true },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { farmer: true, admin: true },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await comparePassword(data.password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
