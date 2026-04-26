import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import "dotenv/config";
import { User } from "../models/User/Users.js";

const JWT_SECRET = process.env.JWT_SECRET || "museart_secret_key_8899";

export const register = async (req, res) => {
  console.log(`[AUTH] Register attempt: ${req.body?.email}`);
  try {
    const { email, password, name, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already in use." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name, role: role || 'collector' });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error("[AUTH ERROR] Register failed:", error);
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database connection pending or failed. Please check MONGODB_URI." });
    }
    res.status(400).json({ error: error.message || "Registration failed." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("[AUTH ERROR] Login failed:", error);
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database connection pending or failed. Please check MONGODB_URI." });
    }
    res.status(500).json({ error: "Login failed" });
  }
};
