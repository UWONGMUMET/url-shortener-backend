import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken, verifyToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const registerUser = async (email, password) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        const error = new Error('User already exists');
        error.status = 409;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword
        }
    });

    return user;
};

export const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
    }

    const token = generateToken(user.id);
    return { token };
};

export const logoutService = async (token) => {
    const decoded = verifyToken(token);

    return prisma.blacklistedToken.create({
        data: {
            token,
            expiresAt: new Date(decoded.exp * 1000)
        }
    });
};