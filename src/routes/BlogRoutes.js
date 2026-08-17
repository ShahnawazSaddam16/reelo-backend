const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {createPost} = require("../controllers/Blogs/create-post");

router.post("/create-post", authMiddleware, limiter, upload.single("media"), createPost);

module.exports = router;