const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (to, code) => {
  const { data, error } = await resend.emails.send({
    from: "Reelo <noreply@buttnetworks.com>",
    to,
    subject: "Verify your email",
    html: `
      <div style="background-color:#0E0E10;padding:40px 20px;font-family:sans-serif;">
        <div style="max-width:480px;margin:0 auto;background-color:#17171A;border-radius:16px;padding:32px;border:1px solid #2A2A2E;">
          <h2 style="color:#ffffff;margin:0 0 8px;font-size:20px;">Email Verification</h2>
          <p style="color:#A0A0A8;margin:0 0 24px;font-size:14px;">Your verification code is:</p>
          <div style="background-color:#0E0E10;border:1px solid #7C3AED;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#A78BFA;letter-spacing:8px;margin:0;font-size:32px;">${code}</h1>
          </div>
          <p style="color:#6B6B72;font-size:13px;margin:0;">This code expires in 10 minutes.</p>
        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = sendVerificationEmail;