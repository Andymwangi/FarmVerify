import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as farmerService from "../services/farmer.service";
import { sendSuccess, sendError } from "../utils/response";
import { CertificationStatus } from "../types";

export const getAllFarmers = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, errors.array()[0].msg, 400);
    return;
  }

  try {
    const status = req.query.status as CertificationStatus | undefined;
    const search = req.query.search as string | undefined;
    const farmers = await farmerService.getAllFarmers(status, search);
    sendSuccess(res, farmers, "Farmers retrieved successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get farmers";
    sendError(res, message, 500);
  }
};

export const getFarmerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const farmer = await farmerService.getFarmerById(req.params.id);
    sendSuccess(res, farmer, "Farmer retrieved successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Farmer not found";
    sendError(res, message, 404);
  }
};

export const updateFarmerStatus = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, errors.array()[0].msg, 400);
    return;
  }

  try {
    if (!req.user) {
      sendError(res, "Authentication required", 401);
      return;
    }

    const farmer = await farmerService.updateFarmerStatus(
      req.params.id,
      req.user.id,
      req.body
    );
    sendSuccess(res, farmer, "Farmer status updated successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update status";
    sendError(res, message, 400);
  }
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await farmerService.getFarmerStats();
    sendSuccess(res, stats, "Stats retrieved successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get stats";
    sendError(res, message, 500);
  }
};
