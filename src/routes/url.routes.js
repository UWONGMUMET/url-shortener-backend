import express from 'express';
import { shortenUrl, redirectToOriginalUrl, getUserUrls, getUrlAnalytics } from '../controllers/url.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authMiddleware, shortenUrl);
router.get("/my", authMiddleware, getUserUrls);
router.get("/:shortCode/analytics", authMiddleware, getUrlAnalytics);
router.get('/:shortCode', redirectToOriginalUrl);

export default router;
