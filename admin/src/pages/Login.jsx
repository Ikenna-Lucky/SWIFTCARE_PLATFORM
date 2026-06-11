import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { assets } from "../assets/assets_admin/assets";
import axios from "axios";
import { toast } from "react-toastify";

const STATS = [
  { value: "100+", label: "Doctors" },
  { value: "50K+", label: "Patients" },
  { value: "6+", label: "Specialities" },
];

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
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        {/* ── Left panel ── */}
        <div className="hidden md:flex flex-col w-72 shrink-0 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600 px-8 py-10 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute top-1/3 -left-12 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 right-8 w-56 h-56 rounded-full bg-white/5" />

          {/* Logo */}
          <div className="relative z-10 mb-8">
            <img
              src={assets.admin_logo}
              alt="SwiftCare"
              className="h-8 w-auto brightness-0 invert"
            />
          </div>

          {/* Headline */}
          <div className="relative z-10 mb-8">
            <h2 className="text-white text-2xl font-bold leading-snug mb-2">
              Staff &amp; Admin
              <br />
              Portal
            </h2>
            <p className="text-teal-200 text-sm leading-relaxed">
              Manage doctors, appointments, and patient records from one place.
            </p>
          </div>

          {/* Stats strip */}
          <div className="relative z-10 flex items-center bg-white/10 border border-white/15 rounded-xl px-4 py-3 mb-8">
            {STATS.map(({ value, label }, i) => (
              <React.Fragment key={label}>
                <div className="flex-1 text-center">
                  <p className="text-white font-bold text-base leading-none mb-0.5">
                    {value}
                  </p>
                  <p className="text-teal-300 text-xs">{label}</p>
                </div>
                {i < STATS.length - 1 && (
                  <div className="w-px h-8 bg-white/20 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Feature list */}
          <div className="relative z-10 space-y-3 mb-8">
            {[
              {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
                label: "Manage doctor profiles",
              },
              {
                icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                label: "Track all appointments",
              },
              {
                icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                label: "View analytics & reports",
              },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-teal-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={icon}
                    />
                  </svg>
                </div>
                <span className="text-teal-100 text-xs">{label}</span>
              </div>
            ))}
          </div>

          {/* Footer badge */}
          <div className="relative z-10 mt-auto">
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <p className="text-teal-100 text-xs font-medium">
                Authorised personnel only
              </p>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
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
