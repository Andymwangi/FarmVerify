import { Request, Response } from "express";
import * as farmerService from "../services/farmer.service";
import { sendSuccess, sendError } from "../utils/response";

export const getMyStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, "Authentication required", 401);
      return;
    }

    const farmer = await farmerService.getFarmerByUserId(req.user.id);
    sendSuccess(res, farmer, "Farmer status retrieved");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get status";
    sendError(res, message, 404);
  }
};
