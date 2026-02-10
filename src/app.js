import express from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config/config.js";

import authRoutes from "./routes/auth.routes.js";
import urlRoutes from "./routes/url.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { morganMiddleware } from "./middlewares/logger.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morganMiddleware);

app.get("/health-check", (req, res) => {
    res.send("URL Shortener Backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/url", apiLimiter, urlRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});