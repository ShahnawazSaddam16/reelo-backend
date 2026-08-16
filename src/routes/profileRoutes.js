const express = require("express");
const router = express.Router();
const {createProfile, userProfile} = require("../controllers/profile");
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/create-profile", authMiddleware, limiter, upload.single("avator"), createProfile);
router.get("/user-profile", authMiddleware, limiter, userProfile);

module.exports = router;