import express from "express";

import {
  appointmentCancel,
  appointmentComplete,
  appointmentDoctor,
  doctorDashboard,
  doctorList,
  doctorProfile,
  loginDoctor,
  updateDocProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();
doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/appointments", authDoctor, appointmentDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/doc-profile", authDoctor, doctorProfile);
doctorRouter.post("/updatedoc-profile", authDoctor, updateDocProfile);

export default doctorRouter;
