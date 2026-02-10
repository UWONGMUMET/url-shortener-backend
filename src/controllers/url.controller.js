import * as urlService from '../services/url.service.js';

export const shortenUrl = async (req, res, next) => {
    try {
        const { longUrl, customCode, expiresAt } = req.body;

        if (!longUrl) {
            const error = new Error("Long URL is required");
            error.status = 400;
            throw error;
        }

        const url = await urlService.createShortUrl(
            { longUrl, customCode, expiresAt },
            req.user.id
        );

        res.status(201).json({
            success: true,
            data: {
                id: url.id,
                shortCode: url.shortCode,
                longUrl: url.longUrl,
                expiresAt: url.expiresAt,
                createdAt: url.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getUserUrls = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const q = req.query.q || "";

        const urls = await urlService.getUrlByShortUrl(
            userId,
            page,
            limit,
            q
        );

        res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                count: urls.length
            },
            data: urls
        });
    } catch (error) {
        next(error);
    }
};

export const getUrlAnalytics = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const userId = req.user.id;

        const analytics = await urlService.getUrlAnalytics(
            shortCode,
            userId
        );

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        next(error);
    }
};

export const redirectToOriginalUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;

        const longUrl = await urlService.increaseUrlAccessCount(
            shortCode,
            {
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            }
        );

        res.redirect(longUrl);
    } catch (error) {
        next(error);
    }
};