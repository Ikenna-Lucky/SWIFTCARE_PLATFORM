import doctorModel from "../models/doctormodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentmodel.js";
import logger from "../config/logger.js";

// --- Change Availability (called from admin route) ---
// docId comes from req.body - this is an admin POST, not a doctor-authed route

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID is required." });
    }
    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found." });
    }
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availability updated." });
  } catch (error) {
    logger.error({ err: error }, "[changeAvailability]");
    res.json({ success: false, message: "Failed to update availability." });
  }
};

// --- Public Doctor List ---

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    logger.error({ err: error }, "[doctorList]");
    res.json({ success: false, message: "Failed to fetch doctors." });
  }
};

// --- Doctor Login ---

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required.",
      });
    }
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials." });
    }
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    logger.error({ err: error }, "[loginDoctor]");
    res.json({ success: false, message: "Login failed. Please try again." });
  }
};

// --- Get Doctor Appointments ---

const appointmentDoctor = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    logger.error({ err: error }, "[appointmentDoctor]");
    res.json({ success: false, message: "Failed to fetch appointments." });
  }
};

// --- Mark Appointment as Completed ---

const appointmentComplete = async (req, res) => {
  try {
    const docId = req.docId;
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
    if (appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Unauthorised action." });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });
    res.json({ success: true, message: "Appointment marked as completed." });
  } catch (error) {
    logger.error({ err: error }, "[appointmentComplete]");
    res.json({ success: false, message: "Failed to complete appointment." });
  }
};

// --- Cancel Appointment (doctor panel) ---

const appointmentCancel = async (req, res) => {
  try {
    const docId = req.docId;
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
    if (appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Unauthorised action." });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    res.json({ success: true, message: "Appointment cancelled." });
  } catch (error) {
    logger.error({ err: error }, "[appointmentCancel]");
    res.json({ success: false, message: "Failed to cancel appointment." });
  }
};

// --- Doctor Dashboard ---

const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) earnings += item.amount;
    });

    const patientSet = new Set();
    appointments.forEach((item) => {
      if (!item.cancelled) patientSet.add(item.userId);
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    logger.error({ err: error }, "[doctorDashboard]");
    res.json({ success: false, message: "Failed to load dashboard data." });
  }
};

// --- Get Doctor Profile ---

const doctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const profileData = await doctorModel.findById(docId).select("-password");
    if (!profileData) {
      return res.json({ success: false, message: "Doctor not found." });
    }
    res.json({ success: true, profileData });
  } catch (error) {
    logger.error({ err: error }, "[doctorProfile]");
    res.json({ success: false, message: "Failed to load profile." });
  }
};

// --- Update Doctor Profile ---

const updateDocProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { fees, address, available } = req.body;

    const updates = {};
    if (fees !== undefined) updates.fees = Number(fees);
    if (address !== undefined) updates.address = address;
    if (available !== undefined) updates.available = available;

    await doctorModel.findByIdAndUpdate(docId, updates);
    res.json({ success: true, message: "Profile updated." });
  } catch (error) {
    logger.error({ err: error }, "[updateDocProfile]");
    res.json({ success: false, message: "Failed to update profile." });
  }
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDocProfile,
};
