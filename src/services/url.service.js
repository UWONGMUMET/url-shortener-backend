import { PrismaClient } from "@prisma/client";
import { generateShortUrl } from "../utils/url.js";

const prisma = new PrismaClient();

export const createShortUrl = async (longUrl, userId) => {
    const shortUrl = generateShortUrl();

    const urlEntry = await prisma.url.create({
        data: {
            longUrl,
            shortCode: shortUrl,
            userId
        }
    })
    return urlEntry;
};

export const getUrlByShortUrl = async (shortUrl) => {
    const urlEntry = await prisma.url.findUnique({
        where: { shortCode: shortUrl }
    });
    return urlEntry;
}

export const increaseUrlAccessCount = async (shortUrl) => {
    const urlEntry = await prisma.url.update({
        where: { shortCode: shortUrl },
        data: {
            clicks: {
                increment: 1
            }
        }
    })
    return urlEntry;
}