import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors";

import { config } from "./config/env";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/error.middleware";

import authRoutes from "./routes/auth.routes";
import farmerRoutes from "./routes/farmer.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(helmet());
// Allow all origins in development for mobile app testing
app.use(cors({ 
  origin: config.nodeEnv === 'development' ? true : config.corsOrigin, 
  credentials: true 
}));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

export default app;
