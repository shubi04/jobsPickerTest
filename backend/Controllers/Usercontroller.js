const User = require("../Model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const otpService = require("../utils/otpService");

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, contactNo, companyName } = req.body;

    // Input validation
    if (!name || !email || !password || !role || !contactNo) {
      return res.status(400).json({ 
        message: "All required fields must be provided",
        required: ["name", "email", "password", "role", "contactNo"]
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long" 
      });
    }

    // Check rate limiting
    const rateCheck = otpService.checkRateLimit(email, 3, 15 * 60 * 1000); // 3 attempts per 15 minutes
    if (!rateCheck.allowed) {
      return res.status(429).json({ 
        message: `Too many registration attempts. Please try again in ${rateCheck.resetIn}`,
        error: "RATE_LIMITED"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists with this email address" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds

    // Generate secure OTP
    const otpData = otpService.generateSecureOTP(email, 'registration');

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      contactNo: contactNo.trim(),
      companyName: role === "employer" ? companyName?.trim() : undefined,
      isVerified: false,
      otp: otpData.otp,
      otpExpires: otpData.expiresAt,
      otpAttempts: 0,
      otpType: otpData.type
    });

    // Send email with proper error handling
    const emailResult = await sendEmail(email, otpData.otp, 'verification');
    
    if (!emailResult || !emailResult.success) {
      console.error(`Failed to send OTP email to ${email}`);
      // In production, you might want to queue this for retry
    }

    // Security: Don't expose sensitive data
    const responseUser = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.status(201).json({
      message: "Registration successful. Please check your email for verification code.",
      user: responseUser,
      otpSent: emailResult?.success || false,
      expiresIn: "10 minutes"
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Registration failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Rate limiting for login attempts
    const rateCheck = otpService.checkRateLimit(`login:${email}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ 
        message: `Too many login attempts. Please try again in ${rateCheck.resetIn}`,
        error: "RATE_LIMITED"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "Please verify your email before logging in",
        error: "EMAIL_NOT_VERIFIED"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT with proper payload
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { 
        expiresIn: "7d",
        issuer: "smart-hire",
        audience: "smart-hire-users"
      }
    );

    // Security: Don't expose sensitive data
    const responseUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      contactNo: user.contactNo,
      companyName: user.companyName
    };

    res.status(200).json({
      message: "Login successful",
      user: responseUser,
      token,
      expiresIn: "7 days"
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Login failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// SEND OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Rate limiting
    const rateCheck = otpService.checkRateLimit(`otp:${email}`, 3, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ 
        message: `Too many OTP requests. Please try again in ${rateCheck.resetIn}`,
        error: "RATE_LIMITED"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new secure OTP
    const otpData = otpService.generateSecureOTP(email, 'resend');

    // Update user with new OTP
    user.otp = otpData.otp;
    user.otpExpires = otpData.expiresAt;
    user.otpAttempts = 0;
    user.otpType = otpData.type;
    await user.save();

    // Send email
    const emailResult = await sendEmail(email, otpData.otp, 'verification');

    res.status(200).json({
      message: "New verification code sent to your email",
      otpSent: emailResult?.success || false,
      expiresIn: "10 minutes",
      attemptsRemaining: rateCheck.remaining
    });

  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ 
      message: "Failed to send OTP. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Rate limiting for verification attempts
    const rateCheck = otpService.checkRateLimit(`verify:${email}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ 
        message: `Too many verification attempts. Please try again in ${rateCheck.resetIn}`,
        error: "RATE_LIMITED"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+otp +otpExpires +otpAttempts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP using service
    const otpData = {
      otp: user.otp,
      expiresAt: user.otpExpires,
      attempts: user.otpAttempts || 0,
      maxAttempts: 5
    };

    const verification = otpService.verifyOTP(email, otp, otpData);

    if (!verification.valid) {
      // Update attempts in database
      if (verification.error === 'INVALID_OTP') {
        user.otpAttempts = (user.otpAttempts || 0) + 1;
        await user.save();
      }

      return res.status(400).json({
        message: verification.message,
        error: verification.error,
        attemptsRemaining: verification.attemptsRemaining
      });
    }

    // Success - verify user and clean up OTP data
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    user.otpType = null;
    user.emailVerifiedAt = new Date();
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      verified: true,
      verifiedAt: user.emailVerifiedAt
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ 
      message: "Verification failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { loginUser, registerUser, sendOtp, verifyOtp };