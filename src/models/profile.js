const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avator: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    links: {
        type: [String],
        default: []
    }
}, { timestamps: true });

// Indexes to speed up lookups
profileSchema.index({ userId: 1 });
profileSchema.index({ username: 1 });

module.exports = mongoose.model("Profile", profileSchema);