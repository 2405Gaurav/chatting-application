import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../utils/config.js";

// --- Helper: Send JWT cookie ---
const sendTokenAsCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,       // ✅ False for HTTP (localhost)
    sameSite: "None",     //
    maxAge: JWT_EXPIRES_IN * 1000, // ms
  });
};

// --- Signup ---
export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    sendTokenAsCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "User signed up successfully",
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- Login ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    sendTokenAsCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: existingUser._id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        profileSetup: existingUser.profileSetup,
        image: existingUser.image,
        color: existingUser.color,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- Get User Info ---
export const getuserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileSetup: userData.profileSetup,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error("Get User Info Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// --- Update Profile ---
export const updateprofile = async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName || !color) {
      console.log("Missing fields in update-profile request");
      return res
        .status(400)
        .send("firstName, lastName, and color are required to update.");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );

    if (!userData) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileSetup: userData.profileSetup,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
