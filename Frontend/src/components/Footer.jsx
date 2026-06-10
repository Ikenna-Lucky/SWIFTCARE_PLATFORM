import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

const QUICK_LINKS = [
  { label: "Home", path: "/" },
  { label: "Find Doctors", path: "/doctors" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Privacy Policy", path: "/" },
];

const SPECIALITIES = [
  "General Physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

const SOCIAL = [
  {
    label: "Twitter / X",
    path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
  },
  {
    label: "Facebook",
    path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
  },
  {
    label: "Instagram",
    path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M6.5 6.5A11.5 11.5 0 0017.5 17.5 11.5 11.5 0 006.5 6.5z",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-24">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 pt-16 pb-8">
        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Invert the logo so it shows white on the dark background */}
            <img
              className="w-36 mb-5 brightness-0 invert"
              src={assets.logo}
              alt="SwiftCare"
            />
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              SwiftCare connects you with trusted, credentialed doctors for
              fast, hassle-free appointment booking. Your health journey starts
              here.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL.map(({ label, path }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={path}
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-white text-xs font-semibold uppercase tracking-wider mb-5">
              Quick Links
            </p>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white text-xs font-semibold uppercase tracking-wider mb-5">
              Get in Touch
            </p>
            <ul className="flex flex-col gap-4">
              {/* Address */}
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <svg
                  className="w-4 h-4 mt-0.5 text-primary flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  Hilltop Trans Station, Suite C30-32, Gwarimpa, Abuja
                </span>
              </li>
              {/* Phone */}
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <svg
                  className="w-4 h-4 text-primary flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+234 916 286 5922</span>
              </li>
              {/* Email */}
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <svg
                  className="w-4 h-4 text-primary flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>support@swiftcare.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} SwiftCare. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
