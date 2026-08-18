const mongoose = require("mongoose");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (value) {
                return emailRegex.test(value);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date }
}, { timestamps: true });

// Indexes to speed up lookups
userSchema.index({ email: 1 });

module.exports = mongoose.model("Users", userSchema);