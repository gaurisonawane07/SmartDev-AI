import User from "../models/user.model.js";

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
    try {
        // User is already attached to req by the 'protect' middleware
        res.status(200).json({
            success: true,
            message: "Profile data fetched from system core.",
            user: req.user,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found in system." });
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ success: false, message: "Access denied: Email overlap detected." });
            }
            user.email = email;
        }

        if (name) user.name = name;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Neural identity updated successfully.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                aiUsageCount: user.aiUsageCount,
                monthlyRequestLimit: user.monthlyRequestLimit,
                subscription: user.subscription
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "System failure during update: " + error.message });
    }
};
