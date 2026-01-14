import { Router } from "express";
import { getMyStatus, downloadCertificate, updateLocation } from "../controllers/farmer.controller";
import { authenticate, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/me/status", authenticate, authorizeRole("FARMER"), getMyStatus);
router.get("/:id/certificate", authenticate, downloadCertificate);
router.patch("/:id/location", authenticate, updateLocation);

export default router;
