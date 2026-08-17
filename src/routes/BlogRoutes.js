const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {createPost, userPosts} = require("../controllers/Blogs/post");

router.post("/create-post", authMiddleware, limiter, upload.any(), createPost);
router.get("/user-posts", authMiddleware, limiter, userPosts);

module.exports = router;