import { PrismaClient } from "@prisma/client";
import { generateShortUrl } from "../utils/url.js";

const prisma = new PrismaClient();

export const createShortUrl = async (data, userId) => {
    const shortCode = data.customCode || generateShortUrl();

    const url = await prisma.url.create({
        data: {
            longUrl: data.longUrl,
            shortCode,
            expiresAt: data.expiresAt ?? null,
            userId
        }
    });

    return url;
};

export const getUrlByShortUrl = async (userId, page = 1, limit = 10, q) => {
    return prisma.url.findMany({
        where: {
            userId,
            ...(q && {
                longUrl: {
                    contains: q,
                    mode: "insensitive"
                }
            })
        },
        skip: (page-1) * limit,
        take: limit,
        orderBy: {
            createdAt: "desc"
        }
    })
};

export const increaseUrlAccessCount = async (shortCode, { ip, userAgent }) => {
    const url = await prisma.url.findUnique({
        where: { shortCode }
    });

    if (!url) {
        const error = new Error("Short URL not found");
        error.status = 404;
        throw error;
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
        const error = new Error("URL has expired");
        error.status = 410;
        throw error;
    }

    await prisma.$transaction([
        prisma.analytics.create({
            data: {
                ip,
                userAgent,
                urlId: url.id
            }
        }),
        prisma.url.update({
            where: { id: url.id },
            data: {
                clicks: {
                    increment: 1
                }
            }
        })
    ]);

    const redirectUrl = url.longUrl;
    return redirectUrl;
};

export const getUrlAnalytics = async (shortCode, userId) => {
    const url = await prisma.url.findUnique({
        where: { shortCode },
        include: {
            analytics: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });

    if (!url) {
        const error = new Error("URL not found");
        error.status = 404;
        throw error;
    }

    if (url.userId !== userId) {
        const error = new Error("Forbidden");
        error.status = 403;
        throw error;
    }

    return {
        shortCode: url.shortCode,
        longUrl: url.longUrl,
        clicks: url.clicks,
        expiresAt: url.expiresAt,
        analytics: url.analytics
    };
};