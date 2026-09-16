const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
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
        type: String,
        default: ""
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        default: []
    }]
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);