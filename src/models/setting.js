const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    notificationSwitch: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Setting", settingSchema);