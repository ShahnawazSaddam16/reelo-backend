const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const {createNotificationControl, getNotificationControl} = require("../controllers/setting");

router.post("/create-notification-control", limiter, authMiddleware, createNotificationControl);
router.get("/get-notification-control", limiter, authMiddleware, getNotificationControl);

module.exports = router;