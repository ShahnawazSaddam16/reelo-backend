const Profile = require("../models/profile");

const createProfile = async (req, res) => {
    try {
        const { username, bio, links } = req.body;

        if (!username) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const existingProfile = await Profile.findOne({ userId: req.user._id });

        if (existingProfile) {
            return res.status(400).json({ success: false, message: "Profile already exists" });
        }

        const avator = req.file ? req.file.path : "";

        const newProfile = await Profile.create({
            userId: req.user._id,
            email: req.user.email,
            username,
            avator,
            bio,
            links
        });

        return res.status(200).json({ success: true, message: "Profile Created Successfully", profile: newProfile });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createProfile };