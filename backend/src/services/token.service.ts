import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/env";
import { UserPayload } from "../types";

export const generateToken = (payload: UserPayload): string => {
  const options: SignOptions = {
    expiresIn: "7d",
  };
  return jwt.sign(
    { id: payload.id, email: payload.email, role: payload.role },
    config.jwtSecret,
    options
  );
};

export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, config.jwtSecret) as UserPayload;
};
