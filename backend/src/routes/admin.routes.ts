import { Router } from "express";
import {
  getAllFarmers,
  getFarmerById,
  updateFarmerStatus,
  getStats,
} from "../controllers/admin.controller";
import { authenticate, authorizeRole } from "../middleware/auth.middleware";
import {
  updateStatusValidation,
  queryValidation,
} from "../middleware/validation.middleware";

const router = Router();

router.use(authenticate, authorizeRole("ADMIN"));

router.get("/farmers", queryValidation, getAllFarmers);
router.get("/farmers/stats", getStats);
router.get("/farmers/:id", getFarmerById);
router.patch("/farmers/:id/status", updateStatusValidation, updateFarmerStatus);

export default router;
