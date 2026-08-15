const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const { SignIn, VerifyEmail, ResendCode, Login, Logout, Me } = require("../controllers/auth");

router.post("/signup", limiter, SignIn);
router.post("/verify-email", VerifyEmail);
router.post("/resend-code", ResendCode);
router.post("/login", limiter, Login);
router.post("/logout", authMiddleware, Logout);
router.get("/me", authMiddleware, Me);

module.exports = router;