import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) * 60 * 1000 || 15 * 60 * 1000, 
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX),
    nodeEnv: process.env.NODE_ENV
};