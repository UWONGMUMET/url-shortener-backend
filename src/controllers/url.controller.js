import * as urlService from '../services/url.service.js';

export const shortenUrl = async (req, res, next) => {
    try {
        const { longUrl } = req.body;
        const userId = req.user.id;

        if (!longUrl) {
            const error = new Error('Long URL is required');
            error.status = 400;
            throw error;
        }

        const urlEntry = await urlService.createShortUrl(longUrl, userId);
        res.status(201).json({
            success: true,
            shortUrl: urlEntry.shortCode,
            message: 'URL shortened successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const redirectToOriginalUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;

        const urlEntry = await urlService.getUrlByShortUrl(shortCode);
        if (!urlEntry) {
            const error = new Error('Short URL not found');
            error.status = 404;
            throw error;
        }

        urlService.increaseUrlAccessCount(shortCode);
        return res.redirect(urlEntry.longUrl);
    } catch (error) {
        next(error);
    }
};

