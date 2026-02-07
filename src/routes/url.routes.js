import express from 'express';
import { shortenUrl, redirectToOriginalUrl } from '../controllers/url.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authMiddleware, shortenUrl);
router.get('/:shortCode', redirectToOriginalUrl);

export default router;
