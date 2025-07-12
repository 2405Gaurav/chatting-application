import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    image: String,
    type: String,

    // ✅ color as a number, representing a theme index
    color: {
      type: Number,
      default: 0, // 0 = default theme
    },

    profileSetup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
