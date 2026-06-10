import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";

const STATS = [
  { value: "100+", label: "Verified Doctors" },
  { value: "50K+", label: "Patients Served" },
  { value: "6+", label: "Specialities" },
];

/**
 * Hero section.
 * Elements are above the fold so they animate in on load using CSS keyframes
 * with staggered animation-delay — no IntersectionObserver needed here.
 */
const Header = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  return (
    <section className="relative bg-gradient-to-br from-primary-light via-white to-white rounded-3xl overflow-hidden min-h-[520px] flex items-center">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative w-full grid md:grid-cols-2 items-center gap-10 px-8 md:px-12 lg:px-16 py-12">
        {/* ── Left: Text content — staggered fade-up on load ── */}
        <div className="flex flex-col gap-6 z-10 max-md:text-center max-md:items-center">
          {/* Live availability badge */}
          <div
            className="hero-up inline-flex items-center gap-2 bg-white border border-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full w-fit shadow-sm"
            style={{ animationDelay: "0ms" }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Doctors available now
          </div>

          {/* Headline */}
          <h1
            className="hero-up text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1]"
            style={{ animationDelay: "100ms" }}
          >
            Book a Doctor
            <span className="block text-primary">You Can Trust</span>
          </h1>

          {/* Sub-copy */}
          <p
            className="hero-up text-gray-500 text-base leading-relaxed max-w-md"
            style={{ animationDelay: "200ms" }}
          >
            Browse verified, credentialed doctors across multiple specialities.
            Schedule appointments in minutes — no waiting, no hassle.
          </p>

          {/* Stats row */}
          <div
            className="hero-up flex items-center gap-6 max-md:justify-center"
            style={{ animationDelay: "300ms" }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-primary">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div
            className="hero-up flex items-center gap-3 flex-wrap max-md:justify-center"
            style={{ animationDelay: "380ms" }}
          >
            <a
              href="#speciality"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              Find a Doctor
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            {!token && (
              <button
                onClick={() => navigate("/login")}
                className="btn-outline text-sm"
              >
                Create Free Account
              </button>
            )}
          </div>

          {/* Social proof */}
          <div
            className="hero-up flex items-center gap-3 max-md:justify-center"
            style={{ animationDelay: "460ms" }}
          >
            <img className="w-20" src={assets.group_profiles} alt="Patients" />
            <p className="text-xs text-gray-500">
              Joined by{" "}
              <span className="font-semibold text-gray-700">50,000+</span>{" "}
              patients
            </p>
          </div>
        </div>

        {/* ── Right: Doctor image + floating cards ── */}
        <div className="relative justify-end hidden md:flex">
          {/* Main doctor image slides in from right */}
          <div
            className="hero-right relative"
            style={{ animationDelay: "150ms" }}
          >
            <img
              className="w-full max-w-md object-contain drop-shadow-xl"
              src={assets.doc_header}
              alt="SwiftCare doctor"
            />

            {/* Floating card: Next available slot */}
            <div
              className="hero-float absolute top-8 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-100"
              style={{ animationDelay: "500ms" }}
            >
              <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Next available</p>
                <p className="text-sm font-semibold text-gray-800">
                  Today, 10:00 AM
                </p>
              </div>
            </div>

            {/* Floating card: Patient rating */}
            <div
              className="hero-float absolute bottom-16 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-100"
              style={{ animationDelay: "650ms" }}
            >
              <div className="flex items-center gap-0.5 mb-1">
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
              <p className="text-sm font-bold text-gray-800">4.9 / 5.0</p>
              <p className="text-xs text-gray-400">Patient rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
