import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../utils/config.js";

// ---------------------
// SIGNUP CONTROLLER
// ---------------------
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
      { userId: user._id, email: user.email, name: user.firstName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("jwt", token, {
      secure: true,
      httpOnly: true,
      sameSite: "None",
      maxAge: JWT_EXPIRES_IN * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          profileSetup: user.profileSetup,
        },
      },
    });
   
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------------
// LOGIN CONTROLLER
// ---------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
      // console.log("testing something")
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
      { userId: existingUser._id, email: existingUser.email, name: existingUser.firstName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("jwt", token, {
      secure: true,
      httpOnly: true,
      sameSite: "None",
      maxAge: JWT_EXPIRES_IN * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          profileSetup: existingUser.profileSetup,
          image: existingUser.image,
          color: existingUser.color,
        },
      },
    });
    
}
  catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
