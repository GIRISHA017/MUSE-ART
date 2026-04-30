import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import "dotenv/config";
import { User } from "../models/User/Users.js";

const JWT_SECRET = process.env.JWT_SECRET || "museart_secret_key_8899";

const mapUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phoneNumber: user.phoneNumber || "",
  profilePicture: user.profilePicture || "",
  address: user.address || "",
  dateOfBirth: user.dateOfBirth || null
});

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
    res.json({ token, user: mapUserPayload(user) });
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
    res.json({ token, user: mapUserPayload(user) });
  } catch (error) {
    console.error("[AUTH ERROR] Login failed:", error);
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database connection pending or failed. Please check MONGODB_URI." });
    }
    res.status(500).json({ error: "Login failed" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ profile: mapUserPayload(user) });
  } catch (error) {
    console.error("[PROFILE ERROR] Failed to fetch profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const allowedFields = ["name", "phoneNumber", "profilePicture", "address", "dateOfBirth"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No profile fields provided for update" });
    }

    if (typeof updates.name !== "undefined") {
      if (typeof updates.name !== "string" || updates.name.trim().length < 2) {
        return res.status(400).json({ error: "Full name must be at least 2 characters" });
      }
      updates.name = updates.name.trim();
    }

    if (typeof updates.phoneNumber !== "undefined") {
      const normalizedPhone = String(updates.phoneNumber).trim();
      const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
      if (normalizedPhone && !phoneRegex.test(normalizedPhone)) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }
      updates.phoneNumber = normalizedPhone;
    }

    if (typeof updates.profilePicture !== "undefined") {
      const picture = String(updates.profilePicture).trim();
      if (picture) {
        const isBase64Image = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(picture);
        if (!isBase64Image) {
          try {
            const parsed = new URL(picture);
            if (!["http:", "https:"].includes(parsed.protocol)) {
              return res.status(400).json({ error: "Profile picture must be a valid image URL or uploaded image" });
            }
          } catch {
            return res.status(400).json({ error: "Profile picture must be a valid image URL or uploaded image" });
          }
        }
      }
      updates.profilePicture = picture;
    }

    if (typeof updates.address !== "undefined") {
      const address = String(updates.address).trim();
      if (address.length > 250) {
        return res.status(400).json({ error: "Address cannot exceed 250 characters" });
      }
      updates.address = address;
    }

    if (typeof updates.dateOfBirth !== "undefined") {
      if (!updates.dateOfBirth) {
        updates.dateOfBirth = null;
      } else {
        const dob = new Date(`${updates.dateOfBirth}T00:00:00`);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (Number.isNaN(dob.getTime()) || dob > today) {
          return res.status(400).json({ error: "Date of birth must be a valid past date" });
        }
        updates.dateOfBirth = dob;
      }
    }

    let hasChanges = false;
    for (const [field, value] of Object.entries(updates)) {
      const currentValue = user[field];
      if (field === "dateOfBirth") {
        const currentTs = currentValue ? new Date(currentValue).getTime() : null;
        const nextTs = value ? new Date(value).getTime() : null;
        if (currentTs !== nextTs) {
          hasChanges = true;
          user[field] = value;
        }
      } else if ((currentValue || "") !== (value || "")) {
        hasChanges = true;
        user[field] = value;
      }
    }

    if (!hasChanges) {
      return res.status(200).json({ message: "No changes detected", profile: mapUserPayload(user) });
    }

    await user.save();
    res.json({ message: "Profile updated successfully", profile: mapUserPayload(user) });
  } catch (error) {
    console.error("[PROFILE ERROR] Failed to update profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
