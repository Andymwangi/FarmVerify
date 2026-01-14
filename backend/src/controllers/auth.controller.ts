import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as authService from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response";

export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, errors.array()[0].msg, 400);
    return;
  }

  try {
    const result = await authService.registerFarmer(req.body);
    sendSuccess(res, result, "Registration successful", 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    sendError(res, message, 400);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, errors.array()[0].msg, 400);
    return;
  }

  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result, "Login successful");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    sendError(res, message, 401);
  }
};
