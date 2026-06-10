import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { assets } from "../assets/assets_admin/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (role === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden flex">
        {/* Left teal panel */}
        <div className="hidden md:flex flex-col justify-between w-64 bg-teal-700 px-8 py-10 shrink-0">
          <div>
            <img
              src={assets.admin_logo}
              alt="SwiftCare"
              className="h-8 w-auto brightness-0 invert mb-8"
            />
            <h2 className="text-white text-xl font-semibold leading-snug">
              Staff &amp; Admin Portal
            </h2>
            <p className="text-teal-200 text-sm mt-2 leading-relaxed">
              Manage doctors, appointments, and patient records from a single
              dashboard.
            </p>
          </div>

          <div className="space-y-3">
            {["Doctors", "Appointments", "Patients"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-teal-100 text-sm"
              >
                <svg
                  className="w-4 h-4 text-teal-300 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {item}
              </div>
            ))}
          </div>

          <p className="text-teal-400 text-xs">
            SwiftCare &mdash; Authorised access only
          </p>
        </div>

        {/* Right form panel */}
        <div className="flex-1 px-8 py-10">
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-6">
            <img
              src={assets.admin_logo}
              alt="SwiftCare"
              className="h-8 w-auto mx-auto"
            />
          </div>

          <h3 className="text-xl font-semibold text-slate-800 mb-1">
            Welcome back
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Sign in to continue to your dashboard.
          </p>

          {/* Role tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            {["Admin", "Doctor"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  role === r
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                className="admin-input"
                type="email"
                placeholder="you@swiftcare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                className="admin-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : `Sign in as ${role}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
