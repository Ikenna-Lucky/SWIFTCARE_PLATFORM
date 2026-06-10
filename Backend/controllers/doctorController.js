import doctorModel from "../models/doctormodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentmodel.js";

// ─── Change Availability (called from admin route) ────────────────────────────
// docId comes from req.body — this is an admin POST, not a doctor-authed route

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
    console.error("[changeAvailability]", error);
    res.json({ success: false, message: "Failed to update availability." });
  }
};

// ─── Public Doctor List ───────────────────────────────────────────────────────

const doctorList = async (req, res) => {
  try {
    // Exclude password and email from the public-facing list
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("[doctorList]", error);
    res.json({ success: false, message: "Failed to fetch doctors." });
  }
};

// ─── Doctor Login ─────────────────────────────────────────────────────────────

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
      // Generic message — don't reveal whether the email exists
      return res.json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error("[loginDoctor]", error);
    res.json({ success: false, message: "Login failed. Please try again." });
  }
};

// ─── Get Doctor Appointments ──────────────────────────────────────────────────
// docId injected by authDoctor middleware

const appointmentDoctor = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("[appointmentDoctor]", error);
    res.json({ success: false, message: "Failed to fetch appointments." });
  }
};

// ─── Mark Appointment as Completed ───────────────────────────────────────────

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

    // Verify the appointment belongs to this doctor
    if (appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Unauthorised action." });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });
    res.json({ success: true, message: "Appointment marked as completed." });
  } catch (error) {
    console.error("[appointmentComplete]", error);
    res.json({ success: false, message: "Failed to complete appointment." });
  }
};

// ─── Cancel Appointment (doctor panel) ───────────────────────────────────────

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

    // Verify the appointment belongs to this doctor
    if (appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Unauthorised action." });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    res.json({ success: true, message: "Appointment cancelled." });
  } catch (error) {
    console.error("[appointmentCancel]", error);
    res.json({ success: false, message: "Failed to cancel appointment." });
  }
};

// ─── Doctor Dashboard ─────────────────────────────────────────────────────────

const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });

    // Sum earnings from completed or paid appointments
    let earnings = 0;
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    // Count unique patients (excluding cancelled appointments)
    const patientSet = new Set();
    appointments.forEach((item) => {
      if (!item.cancelled) patientSet.add(item.userId);
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      // Return a copy so we don't mutate the original array
      latestAppointments: [...appointments].reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error("[doctorDashboard]", error);
    res.json({ success: false, message: "Failed to load dashboard data." });
  }
};

// ─── Get Doctor Profile ───────────────────────────────────────────────────────

const doctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const profileData = await doctorModel.findById(docId).select("-password");
    if (!profileData) {
      return res.json({ success: false, message: "Doctor not found." });
    }
    res.json({ success: true, profileData });
  } catch (error) {
    console.error("[doctorProfile]", error);
    res.json({ success: false, message: "Failed to load profile." });
  }
};

// ─── Update Doctor Profile ────────────────────────────────────────────────────

const updateDocProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { fees, address, available } = req.body;

    // Only update fields that were explicitly sent
    const updates = {};
    if (fees !== undefined) updates.fees = Number(fees);
    if (address !== undefined) updates.address = address;
    if (available !== undefined) updates.available = available;

    await doctorModel.findByIdAndUpdate(docId, updates);
    res.json({ success: true, message: "Profile updated." });
  } catch (error) {
    console.error("[updateDocProfile]", error);
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
