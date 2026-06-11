import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import logger from "./config/logger.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://swiftcare-platform.vercel.app",
  "https://swiftcare-admindoc.vercel.app",
];

app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("SwiftCare API is running.");
});

app.listen(port, () => logger.info(`Server started on port ${port}`));
