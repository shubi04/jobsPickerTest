const crypto = require('crypto');

class OTPService {
  constructor() {
    this.otpAttempts = new Map(); // In production, use Redis
    this.rateLimits = new Map();  // In production, use Redis
  }

  // Generate cryptographically secure OTP
  generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      otp += digits[randomIndex];
    }
    
    return otp;
  }

  // Generate secure OTP with expiry
  generateSecureOTP(email, type = 'verification') {
    const otp = this.generateOTP();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes
    const hash = crypto.createHash('sha256').update(`${email}:${otp}:${type}`).digest('hex');
    
    return {
      otp,
      expiresAt,
      hash,
      type,
      attempts: 0,
      maxAttempts: 5
    };
  }

  // Rate limiting check
  checkRateLimit(email, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const key = `rate_limit:${email}`;
    const now = Date.now();
    
    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, {
        attempts: 1,
        resetTime: now + windowMs
      });
      return { allowed: true, remaining: maxAttempts - 1 };
    }
    
    const rateLimit = this.rateLimits.get(key);
    
    // Reset if window expired
    if (now > rateLimit.resetTime) {
      this.rateLimits.set(key, {
        attempts: 1,
        resetTime: now + windowMs
      });
      return { allowed: true, remaining: maxAttempts - 1 };
    }
    
    // Check if limit exceeded
    if (rateLimit.attempts >= maxAttempts) {
      const resetIn = Math.ceil((rateLimit.resetTime - now) / 1000 / 60);
      return { 
        allowed: false, 
        remaining: 0,
        resetIn: `${resetIn} minutes`
      };
    }
    
    // Increment attempts
    rateLimit.attempts++;
    this.rateLimits.set(key, rateLimit);
    
    return { 
      allowed: true, 
      remaining: maxAttempts - rateLimit.attempts 
    };
  }

  // Verify OTP with security checks
  verifyOTP(email, inputOTP, storedOTPData) {
    if (!storedOTPData) {
      return { 
        valid: false, 
        error: 'OTP_NOT_FOUND',
        message: 'No OTP found for this email' 
      };
    }

    // Check expiry
    if (Date.now() > storedOTPData.expiresAt) {
      return { 
        valid: false, 
        error: 'OTP_EXPIRED',
        message: 'OTP has expired. Please request a new one.' 
      };
    }

    // Check max attempts
    if (storedOTPData.attempts >= storedOTPData.maxAttempts) {
      return { 
        valid: false, 
        error: 'MAX_ATTEMPTS_EXCEEDED',
        message: 'Maximum verification attempts exceeded. Please request a new OTP.' 
      };
    }

    // Verify OTP
    if (inputOTP !== storedOTPData.otp) {
      storedOTPData.attempts++;
      return { 
        valid: false, 
        error: 'INVALID_OTP',
        message: `Invalid OTP. ${storedOTPData.maxAttempts - storedOTPData.attempts} attempts remaining.`,
        attemptsRemaining: storedOTPData.maxAttempts - storedOTPData.attempts
      };
    }

    return { 
      valid: true, 
      message: 'OTP verified successfully' 
    };
  }

  // Clean expired entries (call periodically)
  cleanup() {
    const now = Date.now();
    
    // Clean rate limits
    for (const [key, data] of this.rateLimits.entries()) {
      if (now > data.resetTime) {
        this.rateLimits.delete(key);
      }
    }
    
    // Clean OTP attempts
    for (const [key, data] of this.otpAttempts.entries()) {
      if (now > data.expiresAt) {
        this.otpAttempts.delete(key);
      }
    }
  }

  // Get OTP statistics (for monitoring)
  getStats() {
    return {
      activeRateLimits: this.rateLimits.size,
      activeOTPAttempts: this.otpAttempts.size,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton
const otpService = new OTPService();

// Cleanup every 5 minutes
setInterval(() => {
  otpService.cleanup();
}, 5 * 60 * 1000);

module.exports = otpService;