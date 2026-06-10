import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctormodel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentmodel.js";
import userModel from "../models/usermodel.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Safely parses a JSON string. Returns the parsed object on success,
 * or null if the string is invalid JSON.
 */
const safeParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

// ─── Add Doctor ───────────────────────────────────────────────────────────────

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

    // Presence check — all fields required
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

    // Image is required for a doctor profile
    if (!imageFile) {
      return res.json({
        success: false,
        message: "A profile image is required.",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    // Parse and validate address JSON
    const parsedAddress = safeParseJSON(address);
    if (!parsedAddress) {
      return res.json({ success: false, message: "Invalid address format." });
    }

    // Check for duplicate email before attempting to save
    const existing = await doctorModel.findOne({ email });
    if (existing) {
      return res.json({
        success: false,
        message: "A doctor with this email already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
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
    console.error("[addDoctor]", error);
    res.json({
      success: false,
      message: "Failed to add doctor. Please try again.",
    });
  }
};

// ─── Admin Login ──────────────────────────────────────────────────────────────

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
      // Sign a token containing the admin identity string
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    }

    res.json({ success: false, message: "Invalid credentials." });
  } catch (error) {
    console.error("[loginAdmin]", error);
    res.json({ success: false, message: "Login failed. Please try again." });
  }
};

// ─── All Doctors (admin panel list) ──────────────────────────────────────────

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("[allDoctors]", error);
    res.json({ success: false, message: "Failed to fetch doctors." });
  }
};

// ─── All Appointments ─────────────────────────────────────────────────────────

const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("[appointmentsAdmin]", error);
    res.json({ success: false, message: "Failed to fetch appointments." });
  }
};

// ─── Cancel Appointment (admin) ───────────────────────────────────────────────

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

    // Release the doctor's time slot
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
    console.error("[cancelAppointmentByAdmin]", error);
    res.json({
      success: false,
      message: "Failed to cancel appointment. Please try again.",
    });
  }
};

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

const adminDashboard = async (req, res) => {
  try {
    // Use countDocuments() for counts — far more efficient than fetching full collections
    const [doctorCount, patientCount, appointmentCount, latestAppointments] =
      await Promise.all([
        doctorModel.countDocuments(),
        userModel.countDocuments(),
        appointmentModel.countDocuments(),
        // Fetch only the 5 most recent appointments (sorted descending by creation date)
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
    console.error("[adminDashboard]", error);
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
