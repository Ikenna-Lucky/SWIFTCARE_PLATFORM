import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctormodel.js";
import appointmentModel from "../models/appointmentmodel.js";
import logger from "../config/logger.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Safely parses a JSON string. Returns the parsed value on success, null on failure.
 * Used for address fields sent as JSON strings from multipart form data.
 */
const safeParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

// ─── Register ─────────────────────────────────────────────────────────────────

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    // Reject duplicate email with a friendly message instead of a Mongo key error
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    logger.error({ err: error }, "[registerUser]");
    res.json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      // Generic message — don't reveal whether the email exists
      return res.json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    logger.error({ err: error }, "[loginUser]");
    res.json({ success: false, message: "Login failed. Please try again." });
  }
};

// ─── Get Profile ──────────────────────────────────────────────────────────────

const getProfile = async (req, res) => {
  try {
    // userId injected by authUser middleware
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res.json({ success: false, message: "User not found." });
    }
    res.json({ success: true, userData });
  } catch (error) {
    logger.error({ err: error }, "[getProfile]");
    res.json({ success: false, message: "Failed to load profile." });
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────

const updateProfile = async (req, res) => {
  try {
    // userId injected by authUser middleware
    const userId = req.userId;
    const { name, phone, dob, gender, address } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender || !address) {
      return res.json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // address is sent as a JSON string from multipart form data
    const parsedAddress = safeParseJSON(address);
    if (!parsedAddress) {
      return res.json({ success: false, message: "Invalid address format." });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    // Upload new avatar if provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      await userModel.findByIdAndUpdate(userId, {
        image: imageUpload.secure_url,
      });
    }

    res.json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    logger.error({ err: error }, "[updateProfile]");
    res.json({
      success: false,
      message: "Failed to update profile. Please try again.",
    });
  }
};

// ─── Book Appointment ─────────────────────────────────────────────────────────

const bookAppointment = async (req, res) => {
  try {
    // userId injected by authUser middleware
    const userId = req.userId;
    const { docId, slotTime, slotDate } = req.body;

    if (!docId || !slotTime || !slotDate) {
      return res.json({
        success: false,
        message: "Doctor, date, and time slot are required.",
      });
    }

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found." });
    }

    if (!docData.available) {
      return res.json({
        success: false,
        message: "This doctor is currently unavailable.",
      });
    }

    // Check if the requested slot is already taken
    const slots_booked = { ...docData.slots_booked };
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({
        success: false,
        m