import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import matchRoutes from "./routes/match.routes.js";
import messageRoutes from "./routes/message.routes.js";
import groupRoutes from "./routes/group.routes.js";
import challengeRoutes from "./routes/challenge.routes.js";
import gymRoutes from "./routes/gym.routes.js";
import shareRoutes from "./routes/share.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

/* Middleware */
app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      "https://your-netlify-app.netlify.app", // Production (later)
    ],
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
app.use(express.json());

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/challenge", challengeRoutes);
app.use("/api/gym", gymRoutes);
app.use("/api/share", shareRoutes);

/* Error Handler */
app.use(errorHandler);

export default app;
