import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

/* ─── Validation ─────────────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateField = (field, value) => {
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

const FieldError = ({ message }) =>
  message ? (
    <p
      role="alert"
      className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
    >
      <svg
        className="w-3.5 h-3.5 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  ) : null;

/* ─── Left panel static data ─────────────────────────────────────────── */

const BENEFITS = [
  {
    icon: (
      <svg
        className="w-3.5 h-3.5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    text: "100+ verified specialists, all credentialed",
  },
  {
    icon: (
      <svg
        className="w-3.5 h-3.5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    text: "Book an appointment in under 2 minutes",
  },
  {
    icon: (
      <svg
        className="w-3.5 h-3.5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    text: "Your health data is private and secure",
  },
];

/* ─── Component ──────────────────────────────────────────────────────── */

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

  /** Switch between Sign In and Create Account — always resets field state */
  const handleModeSwitch = (newValue) => {
    setIsSignUp(typeof newValue === "boolean" ? newValue : (v) => !v);
    setName("");
    setEmail("");
    setPassword("");
    setErrors({ name: "", email: "", password: "" });
    setTouched({ name: false, email: false, password: false });
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleChange = (field, value) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = isSignUp
      ? ["name", "email", "password"]
      : ["email", "password"];
    const values = { name, email, password };
    const newErrors = { name: "", email: "", password: "" };
    const newTouched = { name: true, email: true, password: true };

    let hasError = false;
    fields.forEach((f) => {
      const err = validateField(f, values[f]);
      newErrors[f] = err;
      if (err) hasError = true;
    });
    setErrors(newErrors);
    setTouched(newTouched);
    if (hasError) return;

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
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass = (field) =>
    touched[field] && errors[field]
      ? "input-field border-red-400 focus:border-red-400 focus:ring-red-200"
      : "input-field";

  /* ── Render ── */
  return (
    <div className="min-h-[90vh] flex items-center justify-center py-10">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-xl border border-gray-100 grid lg:grid-cols-2">
        {/* ══════════════════════════════════════════════════════
            LEFT PANEL — brand / social proof  (desktop only)
        ══════════════════════════════════════════════════════ */}
        <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-[#065F59] p-12 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.03] rounded-full pointer-events-none" />

          {/* ── Top content ── */}
          <div className="relative z-10 flex flex-col gap-8">
            {/* Logo — inverted to white */}
            <img
              src={assets.logo}
              alt="SwiftCare"
              className="hero-up h-7 w-fit brightness-0 invert"
              style={{ animationDelay: "0ms" }}
            />

            {/* Tagline */}
            <div className="hero-up" style={{ animationDelay: "100ms" }}>
              <h2 className="text-3xl font-bold text-white leading-snug">
                Healthcare that works
                <span className="block text-white/70 mt-1">
                  around your life.
                </span>
              </h2>
            </div>

            {/* Benefit list */}
            <div
              className="hero-up flex flex-col gap-3.5"
              style={{ animationDelay: "200ms" }}
            >
              {BENEFITS.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                    {icon}
                  </div>
                  <p className="text-white/80 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom content ── */}
          <div
            className="hero-up relative z-10 flex flex-col gap-5"
            style={{ animationDelay: "320ms" }}
          >
            {/* Patient testimonial card */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-5">
              {/* Star rating */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                "SwiftCare made it so easy to find a specialist and book — saved
                me hours of back-and-forth phone calls."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  S
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Sarah M.</p>
                  <p className="text-white/50 text-xs">Verified Patient</p>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <img
                src={assets.group_profiles}
                alt="Patients"
                className="w-20 flex-shrink-0"
              />
              <p className="text-white/60 text-xs">
                Trusted by{" "}
                <span className="text-white font-semibold">50,000+</span>{" "}
                patients
              </p>
            </div>
          </div>

          {/* Decorative doctor image — peeks up from bottom-right */}
          <img
            src={assets.doc_header}
            alt=""
            aria-hidden="true"
            className="hero-float absolute bottom-0 right-0 w-52 object-contain object-bottom opacity-20 pointer-events-none select-none"
            style={{ animationDelay: "500ms" }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════
            RIGHT PANEL — form
        ══════════════════════════════════════════════════════ */}
        <div className="bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          {/* Mobile-only logo */}
          <div className="lg:hidden mb-8 text-center">
            <img src={assets.logo} alt="SwiftCare" className="h-7 mx-auto" />
          </div>

          {/* ── Tab switcher ── */}
          <div className="flex bg-gray-50 rounded-2xl p-1 mb-8 border border-gray-100">
            <button
              type="button"
              onClick={() => handleModeSwitch(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                !isSignUp
                  ? "bg-white shadow-sm text-gray-900 border border-gray-100"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isSignUp
                  ? "bg-white shadow-sm text-gray-900 border border-gray-100"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ── Welcome copy ── */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">
              {isSignUp
                ? "Join SwiftCare to book with top verified doctors"
                : "Sign in to manage your appointments and profile"}
            </p>
          </div>

          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Name — sign-up only */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={(e) => handleBlur("name", e.target.value)}
                  placeholder="John Doe"
                  aria-invalid={!!(touched.name && errors.name)}
                  aria-describedby="name-error"
                  className={fieldClass("name")}
                />
                <div id="name-error">
                  <FieldError message={touched.name ? errors.name : ""} />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                placeholder="you@example.com"
                aria-invalid={!!(touched.email && errors.email)}
                aria-describedby="email-error"
                className={fieldClass("email")}
              />
              <div id="email-error">
                <FieldError message={touched.email ? errors.email : ""} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {/* Forgot password — sign-in only, non-functional placeholder */}
                {!isSignUp && (
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline font-medium"
                    onClick={() => toast.info("Password reset coming soon.")}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={(e) => handleBlur("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  aria-invalid={!!(touched.password && errors.password)}
                  aria-describedby="password-error"
                  className={`${fieldClass("password")} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div id="password-error">
                <FieldError message={touched.password ? errors.password : ""} />
              </div>

              {/* Password "Looks good" hint — sign-up only, appears once valid */}
              {isSignUp && password && !errors.password && (
                <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Looks good!
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-full font-semibold text-sm mt-1 flex items-center justify-center gap-2 transition-all duration-200 ${
                isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg hover:scale-[1.01]"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                  Please wait…
                </>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* ── Bottom toggle link ── */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => handleModeSwitch(!isSignUp)}
              className="text-primary font-semibold hover:underline"
            >
              {isSignUp ? "Sign in" : "Create one free"}
            </button>
          </p>

          {/* ── Terms note — sign-up only ── */}
          {isSignUp && (
            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
              By creating an account you agree to our{" "}
              <span className="text-gray-500 font-medium">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-gray-500 font-medium">Privacy Policy</span>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
