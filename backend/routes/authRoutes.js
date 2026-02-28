const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { syncUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Rate limit the sync endpoint to prevent abuse
const syncLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: { message: 'Too many requests, please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// POST /api/auth/sync — called by frontend after every Firebase login
// Verifies Firebase ID token, creates/updates MongoDB user, returns isAdmin flag
router.post('/sync', syncLimiter, protect, syncUser);

module.exports = router;
