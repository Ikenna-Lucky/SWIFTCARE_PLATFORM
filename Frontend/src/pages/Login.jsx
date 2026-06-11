import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (field, value) => {
  switch (field) {
    case "name":
      if (!value.trim()) return "Full name is required.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
      return "";
    case "email":
      if (!value.trim()) return "Email address is required.";
      if (!EMAIL_RE.test(value)) return "Please enter a valid email address.";
      return "";
    case "password":
      if (!value) return "Password is required.";
      if (value.length < 8) return "Password must be at least 8 characters.";
      return "";
    default:
      return "";
  }
};

const FEATURES = [
  {
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    text: "100+ verified specialists, all credentialled",
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    text: "Book an appointment in under 2 minutes",
  },
  {
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    text: "Your health data is private and secure",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { setToken, backendUrl } = useContext(AppContext);

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  };

  const switchMode = () => {
    setIsSignUp((v) => !v);
    setErrors({ name: "", email: "", password: "" });
    setTouched({ name: false, email: false, password: false });
    setName("");
    setEmail("");
    setPassword("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const fields = isSignUp
      ? ["name", "email", "password"]
      : ["email", "password"];
    const newErrors = {};
    fields.forEach((f) => {
      const val = f === "name" ? name : f === "email" ? email : password;
      newErrors[f] = validate(f, val);
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    setTouched({ name: true, email: true, password: true });
    if (Object.values(newErrors).some(Boolean)) return;

    setIsLoading(true);
    try {
      const endpoint = isSignUp ? "/api/user/register" : "/api/user/login";
      const payload = isSignUp
        ? { name, email, password }
        : { email, password };
      const { data } = await axios.post(backendUrl + endpoint, payload);
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 page-enter">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* ── Left panel ── */}
        <div className="hidden md:flex flex-col justify-between w-[220px] lg:w-[420px] shrink-0 bg-gradient-to-br from-primary via-teal-600 to-teal-500 px-5 py-8 lg:px-8 lg:py-10 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-20 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <img
                src={assets.logo}
                alt="SwiftCare"
                className="h-8 w-8 brightness-0 invert"
              />
              <span className="text-white font-bold text-lg">Swiftcare</span>
            </div>

            {/* Headline */}
            <h2 className="text-white text-xl lg:text-3xl font-bold leading-snug mb-1 lg:mb-2">
              Healthcare that works
            </h2>
            <h2 className="text-teal-200 text-xl lg:text-3xl font-bold leading-snug mb-5 lg:mb-8">
              around your life.
            </h2>

            {/* Feature bullets — tablet: hidden, desktop: visible */}
            <ul className="hidden lg:block space-y-4 mb-8">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={f.icon}
                      />
                    </svg>
                  </div>
                  <span className="text-teal-50 text-sm">{f.text}</span>
                </li>
              ))}
            </ul>

            {/* Testimonial card — tablet: hidden, desktop: visible */}
            <div className="hidden lg:block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-6 relative z-10">
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white text-xs leading-relaxed mb-3">
                "SwiftCare made it so easy to find a specialist and book — saved
                me hours of back-and-forth phone calls."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  S
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Sarah M.</p>
                  <p className="text-teal-200 text-xs">Verified Patient</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust row + doctor image */}
          <div className="relative z-10 flex items-end justify-between">
            <div className="flex items-center gap-2">
              <img
                src={assets.group_profiles}
                alt="Patients"
                className="h-8 w-auto"
              />
              <p className="text-teal-100 text-xs">
                Trusted by <span className="font-bold text-white">50,000+</span>{" "}
                patients
              </p>
            </div>
          </div>

          {/* Doctor image */}
          <img
            src={assets.doc_header}
            alt="Doctor"
            className="absolute bottom-0 right-0 h-56 w-auto object-contain object-bottom pointer-events-none"
          />
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-8 lg:px-12">
          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            {["Sign In", "Create Account"].map((tab) => {
              const active = tab === "Sign In" ? !isSignUp : isSignUp;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    if ((tab === "Sign In") === isSignUp) switchMode();
                  }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    active
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h3>
          <p className="text-gray-500 text-sm mb-8">
            {isSignUp
              ? "Join thousands of patients on SwiftCare."
              : "Sign in to manage your appointments and profile"}
          </p>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (touched.name)
                      setErrors((p) => ({
                        ...p,
                        name: validate("name", e.target.value),
                      }));
                  }}
                  onBlur={(e) => handleBlur("name", e.target.value)}
                  className={`input-field ${touched.name && errors.name ? "border-red-400 focus:ring-red-200" : ""}`}
                />
                {touched.name && errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email)
                    setErrors((p) => ({
                      ...p,
                      email: validate("email", e.target.value),
                    }));
                }}
                onBlur={(e) => handleBlur("email", e.target.value)}
                className={`input-field ${touched.email && errors.email ? "border-red-400 focus:ring-red-200" : ""}`}
              />
              {touched.email && errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {!isSignUp && (
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isSignUp ? "Min. 8 characters" : "Enter your password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password)
                      setErrors((p) => ({
                        ...p,
                        password: validate("password", e.target.value),
                      }));
                  }}
                  onBlur={(e) => handleBlur("password", e.target.value)}
                  className={`input-field pr-11 ${touched.password && errors.password ? "border-red-400 focus:ring-red-200" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    ) : (
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Please wait..."
                : isSignUp
                  ? "Create account"
                  : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="text-primary font-semibold hover:underline"
            >
              {isSignUp ? "Sign in" : "Create one free"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
