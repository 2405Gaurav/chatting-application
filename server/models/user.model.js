import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,  // just making sure it's present
    },
    password: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    image: String,
    color: Number,
    profileSetup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);



const User = mongoose.model("User", userSchema);

export default User;
