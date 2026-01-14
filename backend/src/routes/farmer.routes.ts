import { Router } from "express";
import { getMyStatus } from "../controllers/farmer.controller";
import { authenticate, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/me/status", authenticate, authorizeRole("FARMER"), getMyStatus);

export default router;
