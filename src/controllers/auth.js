const Users = require("../models/auth");
const Post = require("../models/Blogs/post");
const Notification = require("../models/Blogs/notification");
const Profile = require("../models/profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
require("dotenv").config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const SignIn = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        const existingEmail = await Users.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const code = generateCode();

        const newUser = await Users.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationCode: code,
            verificationCodeExpires: Date.now() + 10 * 60 * 1000
        });

        try {
            await sendVerificationEmail(email, code);
        } catch (mailErr) {
            console.error("Failed to send verification email:", mailErr);
            try {
                await Users.findByIdAndDelete(newUser._id);
            } catch (delErr) {
                console.error("Failed to delete user after email failure:", delErr);
            }
            return res.status(500).json({
                success: false,
                message: "Failed to send verification email. Check SMTP credentials and network.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Verification code sent to email",
            userId: newUser._id
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const VerifyEmail = async (req, res) => {
    try {
        const { userId, code, email } = req.body;

        if ((!userId && !email) || !code) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const user = userId ? await Users.findById(userId) : await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ success: false, message: "Invalid code" });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Code expired" });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "User Account Created Successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const ResendCode = async (req, res) => {
    try {
        const { userId, email } = req.body;

        if (!userId && !email) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const user = userId ? await Users.findById(userId) : await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        const code = generateCode();
        user.verificationCode = code;
        user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendVerificationEmail(user.email, code);

        return res.status(200).json({ success: true, message: "Verification code resent" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: "Please verify your email first", userId: user._id });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const Logout = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "Logout Successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const Me = async (req, res) => {
    try {
        const user = await Users.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const DeleteAccount = async (req, res) => {
    try {
        const user = await Users.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await Post.deleteMany({ userId: req.userId });
        await Profile.findByIdAndDelete({userId: req.userId});
        await Notification.deleteMany({ userId: req.userId });
        await Users.findByIdAndDelete(req.userId);

        return res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { SignIn, VerifyEmail, ResendCode, Login, Logout, Me, DeleteAccount };