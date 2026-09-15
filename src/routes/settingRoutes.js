const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const authMiddleware = require("../middleware/authMiddleware");
const {createNotificationControl, getNotificationControl, updateAccountType, addAllowedViewer, removeAllowedViewer, getAllowedViewers} = require("../controllers/setting");

router.post("/create-notification-control", limiter, authMiddleware, createNotificationControl);
router.get("/get-notification-control", limiter, authMiddleware, getNotificationControl);
router.post("/update-account-type", limiter, authMiddleware, updateAccountType);
router.post("/add-allowed-viewer", limiter, authMiddleware, addAllowedViewer);
router.post("/remove-allowed-viewer", limiter, authMiddleware, removeAllowedViewer);
router.get("/get-allowed-viewers", limiter, authMiddleware, getAllowedViewers);

module.exports = router;