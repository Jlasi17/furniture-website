const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
// Custom NoSQL sanitizer (express-mongo-sanitize incompatible with newer Express)
const sanitizeObj = (obj) => {
    if (obj && typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
            if (key.startsWith('$') || key.includes('.')) {
                delete obj[key];
            } else {
                sanitizeObj(obj[key]);
            }
        }
    }
};

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // dev
dotenv.config(); // fallback for cloud (env vars injected by platform)

// ── Startup env validation ──────────────────────────────────────────────────
const REQUIRED_ENV = ['MONGODB_URI'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
    console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
}

const app = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet({
    // Allow images from :8000 to be loaded on :3000 (cross-origin dev setup)
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // Disable CSP in dev — re-enable with proper directives in production
    contentSecurityPolicy: false,
}));

// ── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());

// ── NoSQL injection protection (sanitizes req.body only) ────────────────────
app.use((req, _res, next) => {
    sanitizeObj(req.body);
    next();
});

// ── Static uploads (local fallback, not used in production with Cloudinary) ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Database Connection ──────────────────────────────────────────────────────
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        process.exit(1);
    }
};
connectDB();

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 8000;

// Vercel sets NODE_ENV to production automatically.
// Only listen on a port if we're running locally.
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export the app for Vercel Serverless Functions
module.exports = app;
