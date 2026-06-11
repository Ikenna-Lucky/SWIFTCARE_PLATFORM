import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctormodel.js";
import appointmentModel from "../models/appointmentmodel.js";
import logger from "../config/logger.js";
import sendEmail from "../config/mailer.js";
import axios from "axios";
import {
  appointmentConfirmationEmail,
  appointmentCancellationEmail,
  passwordResetEmail,
  emailVerificationEmail,
} from "../utils/emailTemplates.js";

// --- Helpers ---

const safeParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

// --- Register ---

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
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email verification token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      emailVerifyToken: hashedToken,
      emailVerifyExpiry: expiry,
    });
    const user = await newUser.save();

    // Send verification email (non-blocking)
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;
    sendEmail(
      user.email,
      "Verify your SwiftCare email address",
      emailVerificationEmail({ name: user.name, verifyUrl }),
    );

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

// --- Login ---

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

// --- Forgot Password ---

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Email is required." });
    }
    const user = await userModel.findOne({ email });
    // Always respond success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }
    // Generate secure token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expiry = Date.now() + 60 * 60 * 1000; // 1 hour

    await userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: expiry,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    await sendEmail(
      user.email,
      "Reset your SwiftCare password",
      passwordResetEmail({ name: user.name, resetUrl }),
    );

    res.json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    logger.error({ err: error }, "[forgotPassword]");
    res.json({
      success: false,
      message: "Failed to process request. Please try again.",
    });
  }
};

// --- Verify Email ---

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.json({
        success: false,
        message: "Verification token is missing.",
      });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userModel.findOne({
      emailVerifyToken: hashedToken,
      emailVerifyExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.json({
        success: false,
        message: "Verification link is invalid or has expired.",
      });
    }
    await userModel.findByIdAndUpdate(user._id, {
      isVerified: true,
      emailVerifyToken: undefined,
      emailVerifyExpiry: undefined,
    });
    res.json({
      success: true,
      message: "Email verified successfully. You can now book appointments.",
    });
  } catch (error) {
    logger.error({ err: error }, "[verifyEmail]");
    res.json({
      success: false,
      message: "Verification failed. Please try again.",
    });
  }
};

// --- Reset Password ---

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.json({
        success: false,
        message: "Token and new password are required.",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.json({
        success: false,
        message: "Reset link is invalid or has expired.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpiry: undefined,
    });
    res.json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    logger.error({ err: error }, "[resetPassword]");
    res.json({
      success: false,
      message: "Failed to reset password. Please try again.",
    });
  }
};

// --- Get Profile ---

const getProfile = async (req, res) => {
  try {
    const userData = await userModel
      .findById(req.userId)
      .select("-password -resetPasswordToken -resetPasswordExpiry");
    if (!userData) {
      return res.json({ success: false, message: "User not found." });
    }
    res.json({ success: true, userData });
  } catch (error) {
    logger.error({ err: error }, "[getProfile]");
    res.json({ success: false, message: "Failed to load profile." });
  }
};

// --- Update Profile ---

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, dob, gender, address } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender || !address) {
      return res.json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }
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

// --- Book Appointment ---

const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { docId, slotTime, slotDate } = req.body;

    if (!docId || !slotTime || !slotDate) {
      return res.json({
        success: false,
        message: "Doctor, date, and time slot are required.",
      });
    }
    const userVerifyCheck = await userModel
      .findById(userId)
      .select("isVerified");
    if (!userVerifyCheck?.isVerified) {
      return res.json({
        success: false,
        message:
          "Please verify your email address before booking an appointment.",
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

    const slots_booked = { ...docData.slots_booked };
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({
        success: false,
        message: "This time slot is no longer available.",
      });
    }
    if (slots_booked[slotDate]) {
      slots_booked[slotDate].push(slotTime);
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    const userData = await userModel
      .findById(userId)
      .select("-password -resetPasswordToken -resetPasswordExpiry");
    const docSnapshot = docData.toObject();
    delete docSnapshot.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData: docSnapshot,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // Send confirmation email (non-blocking)
    const [day, month, year] = slotDate.split("_");
    const months = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const readableDate = `${day} ${months[Number(month)]} ${year}`;

    sendEmail(
      userData.email,
      "Your appointment is confirmed — SwiftCare",
      appointmentConfirmationEmail({
        patientName: userData.name,
        doctorName: docData.name,
        speciality: docData.speciality,
        slotDate: readableDate,
        slotTime,
        fees: docData.fees,
      }),
    );

    res.json({
      success: true,
      message: "Appointment booked with " + docData.name + ".",
    });
  } catch (error) {
    logger.error({ err: error }, "[bookAppointment]");
    res.json({
      success: false,
      message: "Failed to book appointment. Please try again.",
    });
  }
};

// --- List Appointments ---

const listAppointment = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.userId });
    res.json({ success: true, appointments });
  } catch (error) {
    logger.error({ err: error }, "[listAppointment]");
    res.json({ success: false, message: "Failed to load appointments." });
  }
};

// --- Cancel Appointment ---

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.json({
        success: false,
        message: "Appointment ID is required.",
      });
    }
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found." });
    }
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorised action." });
    }
    if (appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment is already cancelled.",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    if (doctorData) {
      const slots_booked = { ...doctorData.slots_booked };
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(
          (t) => t !== slotTime,
        );
      }
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    }

    // Send cancellation email (non-blocking)
    const userData = await userModel.findById(userId).select("name email");
    if (userData && doctorData) {
      const [day, month, year] = slotDate.split("_");
      const months = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      sendEmail(
        userData.email,
        "Your appointment has been cancelled — SwiftCare",
        appointmentCancellationEmail({
          patientName: userData.name,
          doctorName: doctorData.name,
          slotDate: `${day} ${months[Number(month)]} ${year}`,
          slotTime,
          cancelledBy: "patient",
        }),
      );
    }

    res.json({ success: true, message: "Appointment cancelled." });
  } catch (error) {
    logger.error({ err: error }, "[cancelAppointment]");
    res.json({
      success: false,
      message: "Failed to cancel appointment. Please try again.",
    });
  }
};

// --- Initialize Paystack Payment ---

const initializePayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.json({
        success: false,
        message: "Appointment ID is required.",
      });
    }
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found." });
    }
    if (appointment.userId !== userId) {
      return res.json({ success: false, message: "Unauthorised action." });
    }
    if (appointment.payment) {
      return res.json({
        success: false,
        message: "This appointment has already been paid for.",
      });
    }
    if (appointment.cancelled) {
      return res.json({
        success: false,
        message: "Cannot pay for a cancelled appointment.",
      });
    }

    const userData = await userModel.findById(userId).select("email name");
    const reference = `appt_${appointmentId}_${Date.now()}`;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: userData.email,
        amount: appointment.amount * 100, // Paystack uses kobo/pesewas (smallest unit)
        reference,
        callback_url: `${process.env.FRONTEND_URL}/payment-verify`,
        metadata: { appointmentId, userId },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.status) {
      res.json({
        success: true,
        authorization_url: response.data.data.authorization_url,
        reference,
      });
    } else {
      res.json({ success: false, message: "Failed to initialize payment." });
    }
  } catch (error) {
    logger.error({ err: error }, "[initializePayment]");
    res.json({
      success: false,
      message: "Payment initialization failed. Please try again.",
    });
  }
};

// --- Verify Paystack Payment ---

const verifyPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { reference } = req.body;

    if (!reference) {
      return res.json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      },
    );

    if (!response.data.status || response.data.data.status !== "success") {
      return res.json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    const { appointmentId } = response.data.data.metadata;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found." });
    }
    if (appointment.userId !== userId) {
      return res.json({ success: false, message: "Unauthorised action." });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
    res.json({
      success: true,
      message: "Payment confirmed. Your appointment is all set!",
    });
  } catch (error) {
    logger.error({ err: error }, "[verifyPayment]");
    res.json({
      success: false,
      message: "Payment verification failed. Please contact support.",
    });
  }
};

export {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  initializePayment,
  verifyPayment,
};
