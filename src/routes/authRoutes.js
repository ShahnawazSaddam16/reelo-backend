const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const { SignIn, VerifyEmail, ResendCode, Login, Logout, Me, DeleteAccount, ForgotPassword, ResetPassword } = require("../controllers/auth");

router.post("/signup", limiter, SignIn);
router.post("/verify-email", VerifyEmail);
router.post("/resend-code", ResendCode);
router.post("/login", limiter, Login);
router.post("/logout", limiter, authMiddleware, Logout);
router.get("/me", limiter, authMiddleware, Me);
router.delete("/delete-account", authMiddleware, limiter, DeleteAccount);
router.post("/forgot-password", limiter, ForgotPassword);
router.post("/reset-password", limiter, ResetPassword);

module.exports = router;