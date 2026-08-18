const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Array,
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);