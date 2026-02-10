import rateLimit from "express-rate-limit";
import { config } from "../config/config.js";

export const apiLimiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later."
    }
});

export const authLimiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.authRateLimitMax,
});