const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const {createNotificationControl, getNotificationControl, updateAccountType, addFollower, removeFollower} = require("../controllers/setting");

router.post("/create-notification-control", limiter, authMiddleware, createNotificationControl);
router.get("/get-notification-control", limiter, authMiddleware, getNotificationControl);
router.post("/update-account-type", limiter, authMiddleware, updateAccountType);
router.post("/add-follower", limiter, authMiddleware, addFollower);
router.post("/remove-follower", limiter, authMiddleware, removeFollower);

module.exports = router;