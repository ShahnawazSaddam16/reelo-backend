const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {createPost, userPosts, editPost, deletePost, getAllPosts} = require("../controllers/Blogs/post");

//Post Routes
router.post("/create-post", authMiddleware, limiter, upload.any(), createPost);
router.get("/my-posts", authMiddleware, limiter, userPosts);
router.put("/edit-post/:id", authMiddleware, limiter, upload.any(), editPost);
router.delete("/delete-post/:id", authMiddleware, limiter, deletePost);
router.get("/all-posts", authMiddleware, limiter, getAllPosts);

module.exports = router;