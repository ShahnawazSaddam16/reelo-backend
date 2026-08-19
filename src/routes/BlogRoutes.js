const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {createPost, userPosts, editPost, deletePost, getAllPosts, getPostsByUserId} = require("../controllers/Blogs/post");
const {toggleLike, addComment, deleteComment, getComments} = require("../controllers/Blogs/Postinteractions");

//Post Routes
router.post("/create-post", authMiddleware, limiter, upload.any(), createPost);
router.get("/my-posts", authMiddleware, limiter, userPosts);
router.put("/edit-post/:id", authMiddleware, limiter, upload.any(), editPost);
router.delete("/delete-post/:id", authMiddleware, limiter, deletePost);
router.get("/all-posts", authMiddleware, limiter, getAllPosts);
router.get("/user-posts/:profileId", authMiddleware, limiter, getPostsByUserId);

//Post Intercations Routes
router.post("/:id/like", authMiddleware, limiter, toggleLike);
router.post("/:id/comment", authMiddleware, limiter, addComment);
router.delete("/:id/comment/:commentId", authMiddleware, limiter, deleteComment);
router.get("/:id/comments",authMiddleware, limiter, getComments);

module.exports = router;