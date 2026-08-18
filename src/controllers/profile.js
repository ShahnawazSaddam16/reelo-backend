const Profile = require("../models/profile");
const Users = require("../models/auth");

const createProfile = async (req, res) => {
    try {
        const { username, bio, links } = req.body;

        if (!username) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }


        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await Users.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const existingProfile = await Profile.findOne({ userId: req.userId });
        if (existingProfile) {
            return res.status(400).json({ success: false, message: "Profile already exists" });
        }

        const avator = req.file ? req.file.path : "";

        const newProfile = await Profile.create({
            userId: req.userId,
            email: user.email,
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

const userProfile = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const profile = await Profile.findOne({ userId: req.userId });

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        return res.status(200).json({ success: true, profile });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const editProfile = async (req, res) => {
    try {
        const { username, bio, links } = req.body;

        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const profile = await Profile.findOne({ userId: req.userId });
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        if (username) profile.username = username;
        if (bio) profile.bio = bio;
        if (links) profile.links = links;
        if (req.file) profile.avator = req.file.path;

        await profile.save();

        return res.status(200).json({ success: true, message: "Profile Updated Successfully", profile });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const getAllProfiles = async (req, res) => {
    try {
        const { search = "", page = 1, limit = 15 } = req.query;

        const query = search
            ? { username: { $regex: `^${search}`, $options: "i" } }
            : {};

        const allProfiles = await Profile.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Profile.countDocuments(query);

        return res.status(200).json({
            success: true,
            allProfiles,
            hasMore: Number(page) * Number(limit) < total,
            total
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await Profile.findById(id);

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        return res.status(200).json({ success: true, profile });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


module.exports = { createProfile, userProfile, editProfile, getAllProfiles, getProfileById };