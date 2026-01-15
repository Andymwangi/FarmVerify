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

export const downloadCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, "Authentication required", 401);
      return;
    }

    const { id } = req.params;
    const farmer = await farmerService.getFarmerById(id);

    // Authorization check: Admin or the farmer themselves
    if (req.user.role !== "ADMIN" && farmer.userId !== req.user.id) {
      sendError(res, "Not authorized to access this certificate", 403);
      return;
    }

    if (farmer.certificationStatus !== "CERTIFIED") {
      sendError(res, "Certificate is not available. Status: " + farmer.certificationStatus, 400);
      return;
    }

    const certificateData = {
      farmerName: farmer.name,
      farmSize: farmer.farmSize,
      cropType: farmer.cropType,
      issueDate: farmer.certifiedAt || new Date(),
      certificateId: `CERT-${farmer.id.substring(0, 8).toUpperCase()}`,
      locationAddress: farmer.locationAddress || undefined,
      latitude: farmer.latitude || undefined,
      longitude: farmer.longitude || undefined,
    };

    const { generateCertificate } = await import("../services/certificate.service");
    generateCertificate(certificateData, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to download certificate";
    // If headers already sent (stream started), don't try to send JSON error
    if (!res.headersSent) {
      sendError(res, message, 500);
    }
  }
};

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, "Authentication required", 401);
      return;
    }

    const { id } = req.params;
    const { latitude, longitude } = req.body;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      sendError(res, "Invalid coordinates", 400);
      return;
    }

    const farmer = await farmerService.getFarmerById(id);

    if (req.user.role !== "ADMIN" && farmer.userId !== req.user.id) {
      sendError(res, "Not authorized to update this location", 403);
      return;
    }

    const { validateCoordinates } = await import("../services/location.service");
    if (!validateCoordinates(latitude, longitude)) {
      sendError(res, "Invalid coordinates range", 400);
      return;
    }

    const updatedFarmer = await farmerService.updateFarmerLocation(id, latitude, longitude);
    sendSuccess(res, updatedFarmer, "Location updated successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update location";
    sendError(res, message, 500);
  }
};
