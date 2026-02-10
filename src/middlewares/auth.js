import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid authorization format"
        });
    }

    const token = authHeader.split(" ")[1].trim();

    try {
        const blacklisted = await prisma.blacklistedToken.findUnique({
            where: { token }
        });

        if (blacklisted) {
            return res.status(401).json({
                success: false,
                message: "Token has been logged out"
            });
        }

        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found"
            });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token"
        });
    }
};