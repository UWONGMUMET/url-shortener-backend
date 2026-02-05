import rateLimit from "express-rate-limit";
import { config } from "../config/config.js";

export const rateLimiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later."
    }
});