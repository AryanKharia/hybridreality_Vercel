// Add this field to your existing User model
// This assumes you have an existing userModel with the following structure

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Add this new field
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  // Keep existing fields
  resetToken: String,
  resetTokenExpire: Date,
  wishlist: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: "Property",
    default: []
  }
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

export default userModel;