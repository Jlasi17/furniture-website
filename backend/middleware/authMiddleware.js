const { verifyFirebaseToken } = require('../lib/firebaseAdmin');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const idToken = authHeader.split(' ')[1];
    try {
        const decoded = await verifyFirebaseToken(idToken);

        // Find MongoDB user by Firebase UID
        let user = await User.findOne({ firebaseUid: decoded.uid });

        if (!user) {
            // Fallback: try by email (for users not yet linked to Firebase UID)
            user = await User.findOne({ email: decoded.email });
            if (user && !user.firebaseUid) {
                user.firebaseUid = decoded.uid;
                await user.save();
            }
        }

        req.firebaseUser = decoded;
        req.user = user; // may be null for brand-new users — syncUser creates them
        return next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res.status(401).json({ message: 'Not authorized as an admin' });
};

module.exports = { protect, admin };
