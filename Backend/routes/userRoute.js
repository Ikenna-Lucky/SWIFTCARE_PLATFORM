import express from "express";
import {
  bookAppointment,
  cancelAppointment,
  forgotPassword,
  resetPassword,
  getProfile,
  listAppointment,
  loginUser,
  registerUser,
  updateProfile,
  initializePayment,
  verifyPayment,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  authUser,
  upload.single("image"),
  updateProfile,
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/initialize-payment", authUser, initializePayment);
userRouter.post("/verify-payment", authUser, verifyPayment);

export default userRouter;
