const express = require("express");
const router = express.Router();
const {createProfile, userProfile, editProfile, getAllProfiles, getProfileById} = require("../controllers/profile");
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/create-profile", authMiddleware, limiter, upload.single("avator"), createProfile);
router.get("/my-profile", authMiddleware, limiter, userProfile);
router.put("/edit-profile", authMiddleware, limiter, upload.single("avator"), editProfile);
router.get("/all-profiles", authMiddleware, limiter, getAllProfiles);
router.get("/user-profile/:id", authMiddleware, limiter, getProfileById);

module.exports = router;