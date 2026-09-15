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
    },
    accountType: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
    allowedViewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }]
}, { timestamps: true });

module.exports = mongoose.model("Setting", settingSchema);