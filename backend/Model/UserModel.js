const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["jobseeker","employer"],
      required: true,
    },

    contactNo: {
      type: String,
      required: true,
      trim: true,
    },

    // OTP fields for production-level security
    otp: {
      type: String,
      select: false // Don't include in queries by default
    },
    otpExpires: {
      type: Date,
      select: false
    },
    otpAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    otpType: {
      type: String,
      enum: ['registration', 'login', 'reset', 'resend'],
      select: false
    },
    
    isVerified: {
      type: Boolean,
      default: false
    },
    emailVerifiedAt: {
      type: Date
    },
    
    companyName: {
      type: String,
      required: function() {
        return this.role === "employer";
      },
      trim: true,
      maxlength: 200
    },

    // Security fields
    lastLoginAt: {
      type: Date
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date
    },
    
    // Account status
    isActive: {
      type: Boolean,
      default: true
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deactivated'],
      default: 'active'
    }
  },
  { 
    timestamps: true,
    // Add indexes for better performance
    indexes: [
      { email: 1 },
      { role: 1 },
      { isVerified: 1 },
      { accountStatus: 1 }
    ]
  }
);

// Virtual for account lock status
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware for security
UserSchema.pre('save', async function() {
  // Clean up expired OTP data
  if (this.otpExpires && this.otpExpires < Date.now()) {
    this.otp = undefined;
    this.otpExpires = undefined;
    this.otpAttempts = 0;
    this.otpType = undefined;
  }
});

// Instance methods
UserSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we have hit max attempts and it's not locked, lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

module.exports = mongoose.model("User", UserSchema);