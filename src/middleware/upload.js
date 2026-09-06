const multer = require("multer");
const { storage } = require("../utils/cloudinary");

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});
module.exports = upload;