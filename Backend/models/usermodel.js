import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Default is an empty string — the frontend shows a placeholder/initials when blank.
    // Set DEFAULT_AVATAR_URL in .env to pre-populate with a real image URL.
    image: { type: String, default: process.env.DEFAULT_AVATAR_URL || "" },
    address: { type: Object, default: { line1: "", line2: "" } },
    gender: { type: String, default: "Not Selected" },
    dob: { type: String, default: "Not Selected" },
    phone: { type: String, default: "0000000000" },
  },
  { timestamps: true },
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
