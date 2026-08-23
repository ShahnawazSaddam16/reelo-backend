const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {createStory, getStory, getAllStories} = require("../controllers/Stories/story");

router.post("/create-story", limiter, authMiddleware, upload.single("file"), createStory);
router.get("/get-story", limiter, authMiddleware, getStory);
router.get("/get-all-stories", limiter, authMiddleware, getAllStories);

module.exports = router;