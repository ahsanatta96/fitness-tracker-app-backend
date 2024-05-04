const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: function () {
        switch (this.role) {
          case "trainer":
            return "Trainer";
          case "trainee":
            return "Trainee";
          case "admin":
            return "Admin";
          default:
            throw new Error("Invalid role");
        }
      },
    },
    first_name: {
      type: String,
      required: [true, "Please provide your first name"],
    },
    last_name: {
      type: String,
      required: [true, "Please provide your last name"],
    },
    profile_profile: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
    },
    role: {
      type: String,
      enum: ["trainer", "trainee", "admin"],
      default: "trainee",
    },
    status: {
      type: String,
      enum: ["active", "pending", "rejected"],
      default: function () {
        return this.role === "trainer" ? "pending" : "active";
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

// Generate password reset token
UserSchema.methods.generateVerificationToken = function () {
  // Generate a random 4-digit code
  const resetToken = Math.floor(1000 + Math.random() * 9000);

  // Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken.toString())
    .digest("hex");

  // Set token expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
