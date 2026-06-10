import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
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
    text: "Book appointments instantly",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    text: "Access top-rated doctors",
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

  const isFormValid = () => {
    if (isSignUp && validate("name", name)) return false;
    if (validate("email", email)) return false;
    if (validate("password", password)) return false;
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Touch all fields to show validation
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

  const EyeIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      {showPassword ? (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </>
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
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 page-enter">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex">
        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-between w-80 bg-gradient-to-br from-primary to-teal-500 px-8 py-10 shrink-0">
          <div>
            <h2 className="text-white text-2xl font-bold leading-snug mb-3">
              {isSignUp ? "Join SwiftCare" : "Welcome back"}
            </h2>
            <p className="text-teal-100 text-sm leading-relaxed">
              {isSignUp
                ? "Create an account to book appointments with top doctors."
                : "Sign in to manage your appointments and health records."}
            </p>
          </div>
          <ul className="space-y-4">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={f.icon}
                    />
                  </svg>
                </div>
                <span className="text-teal-100 text-sm leading-snug">
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-teal-300 text-xs">
            SwiftCare &copy; {new Date().getFullYear()}
          </p>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 px-8 py-10 md:px-10">
          {/* Mobile title */}
          <h2 className="md:hidden text-2xl font-bold text-gray-900 mb-1">
            {isSignUp ? "Create account" : "Sign in"}
          </h2>

          <div className="hidden md:block mb-8">
            <h3 className="text-xl font-bold text-gray-900">
              {isSignUp ? "Create your account" : "Sign in to your account"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({ name: "", email: "", password: "" });
                  setTouched({ name: false, email: false, password: false });
                }}
                className="text-primary font-semibold hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
                Email address
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
                    className="text-xs text-primary hover:underline font-medium"
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
                  className={`input-field pr-10 ${touched.password && errors.password ? "border-red-400 focus:ring-red-200" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon />
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Please wait..."
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          {/* Mobile toggle */}
          <p className="md:hidden text-center text-sm text-gray-500 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrors({ name: "", email: "", password: "" });
                setTouched({ name: false, email: false, password: false });
              }}
              className="text-primary font-semibold hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
