import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctormodel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentmodel.js";
import userModel from "../models/usermodel.js";
import logger from "../config/logger.js";

// Safely parses a JSON string. Returns the parsed object on success, null if invalid.
const safeParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

// --- Add Doctor ---

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({
        success: false,
        message: "Missing details. Please fill all fields.",
      });
    }
    if (!imageFile) {
      return res.json({
        success: false,
        message: "A profile image is required.",
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

    const parsedAddress = safeParseJSON(address);
    if (!parsedAddress) {
      return res.json({ success: false, message: "Invalid address format." });
    }

    const existing = await doctorModel.findOne({ email });
    if (existing) {
      return res.json({
        success: false,
        message: "A doctor with this email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const doctorData = {
      name,
      email,
      image: imageUpload.secure_url,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees: Number(fees),
      address: parsedAddress,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "Doctor added successfully." });
  } catch (error) {
    logger.error({ err: error }, "[addDoctor]");
    res.json({
      success: false,
      message: "Failed to add doctor. Please try again.",
    });
  }
};

// --- Admin Login ---

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required.",
      });
    }
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    }
    res.json({ success: false, message: "Invalid credentials." });
  } catch (error) {
    logger.error({ err: error }, "[loginAdmin]");
    res.json({ success: false, message: "Login failed. Please try again." });
  }
};

// --- All Doctors ---

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    logger.error({ err: error }, "[allDoctors]");
    res.json({ success: false, message: "Failed to fetch doctors." });
  }
};

// --- All Appointments ---

const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    logger.error({ err: error }, "[appointmentsAdmin]");
    res.json({ success: false, message: "Failed to fetch appointments." });
  }
};

// --- Cancel Appointment (admin) ---

const cancelAppointmentByAdmin = async (req, res) => {
  try {
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
    res.json({ success: true, message: "Appointment cancelled." });
  } catch (error) {
    logger.error({ err: error }, "[cancelAppointmentByAdmin]");
    res.json({
      success: false,
      message: "Failed to cancel appointment. Please try again.",
    });
  }
};

// --- Admin Dashboard ---

const adminDashboard = async (req, res) => {
  try {
    const [doctorCount, patientCount, appointmentCount, latestAppointments] =
      await Promise.all([
        doctorModel.countDocuments(),
        userModel.countDocuments(),
        appointmentModel.countDocuments(),
        appointmentModel.find({}).sort({ date: -1 }).limit(5),
      ]);
    const dashData = {
      doctors: doctorCount,
      patients: patientCount,
      appointment: appointmentCount,
      latestAppointments,
    };
    res.json({ success: true, dashData });
  } catch (error) {
    logger.error({ err: error }, "[adminDashboard]");
    res.json({ success: false, message: "Failed to load dashboard data." });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  cancelAppointmentByAdmin,
  adminDashboard,
};
