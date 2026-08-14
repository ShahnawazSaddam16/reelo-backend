const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (to, code) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Verify your email",
        html: `<div style="font-family:sans-serif"><h2>Email Verification</h2><p>Your verification code is:</p><h1 style="letter-spacing:4px">${code}</h1><p>This code expires in 10 minutes.</p></div>`
    });
};

module.exports = sendVerificationEmail;