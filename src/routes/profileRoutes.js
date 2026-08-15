const express = require("express");
const router = express.Router();
const {createProfile} = require("../controllers/profile");
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/create", authMiddleware, limiter, upload.single("avator"), createProfile);

module.exports = router;