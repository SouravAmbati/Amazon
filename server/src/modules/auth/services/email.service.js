import { mailTransporter } from "../../../config/mail.js";


export async function sendVerificationEmail({
  email,
  firstName,
  otp,
}) {
  await mailTransporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Verify your email address",
    text: `
Hello ${firstName},

Welcome to Amazon Clone!

Your verification code is:

${otp}

This code expires in 10 minutes.

If you didn't create this account, please ignore this email.
`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
    <h2>Email Verification</h2>

    <p>Hello <strong>${firstName}</strong>,</p>

    <p>Thank you for registering.</p>

    <p>Your verification code is:</p>

    <h1 style="letter-spacing:8px;color:#2563eb;">
        ${otp}
    </h1>

    <p>This code expires in <strong>10 minutes</strong>.</p>

    <p>If you didn't create this account, simply ignore this email.</p>
</div>
`,
  });
}