const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  // Always log OTP to console for development
  console.log(`=================================`);
  console.log(`OTP for ${email}: ${otp}`);
  console.log(`=================================`);

  // Skip actual email sending if disabled in .env
  if (process.env.EMAIL_ENABLED === "false") {
    console.log(`📝 EMAIL_ENABLED=false → Use OTP from console above`);
    return { success: true };
  }

  try {
    // Use credentials from .env
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter
    await transporter.verify();

    let info = await transporter.sendMail({
      from: `"Smart Hire" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Smart Hire - Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4CAF50;">Smart Hire</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Email Verification</h2>
            <p style="font-size: 16px; color: #666;">Hello,</p>
            <p style="font-size: 16px; color: #666;">Your verification code is:</p>
            <div style="background: #4CAF50; color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #999; text-align: center;">
              This code will expire in 10 minutes.<br>
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      `,
      text: `Your Smart Hire verification code is: ${otp}. This code will expire in 10 minutes.`,
    });

    console.log(`✅ Email sent successfully to ${email}`);
    console.log(`Message ID: ${info.messageId}`);
    return { success: true };

  } catch (error) {
    console.log(`❌ Email failed: ${error.message}`);
    console.log(`📝 Use this OTP from console: ${otp}`);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;