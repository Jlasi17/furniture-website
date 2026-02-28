const User = require('../models/User');

// @desc  Sync a Firebase-authenticated user with our MongoDB
// @route POST /api/auth/sync
// @access Private (requires valid Firebase ID token via protect middleware)
const syncUser = async (req, res) => {
    try {
        const { uid, email, name: fbName } = req.firebaseUser;
        const { name } = req.body; // optional display name from frontend

        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            // Try to find by email (existing users before Firebase migration)
            user = await User.findOne({ email });
        }

        if (user) {
            // Update name/firebaseUid if missing
            if (!user.firebaseUid) user.firebaseUid = uid;
            if (name && !user.name) user.name = name;
            await user.save();
        } else {
            // Brand new user — create in MongoDB
            user = await User.create({
                firebaseUid: uid,
                name: name || fbName || email?.split('@')[0] || 'User',
                email,
                isAdmin: false,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        console.error('Sync error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { syncUser };
