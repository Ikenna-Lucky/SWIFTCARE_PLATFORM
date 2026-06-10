import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";

/** Central nav link config — add/remove links in one place */
const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/doctors", label: "Find Doctors" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  // Apply drop-shadow once the user scrolls past 10px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = showMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMenu]);

  const handleLogOut = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "border-b border-gray-100"
        }`}
      >
        <div className="mx-4 sm:mx-[10%] flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <img
            onClick={handleLogoClick}
            className="w-36 cursor-pointer"
            src={assets.logo}
            alt="SwiftCare"
          />

          {/* ── Desktop nav links ── */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ path, label }) => (
              <NavLink key={path} to={path} end={path === "/"}>
                {({ isActive }) => (
                  <li
                    className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${
                      isActive
                        ? "text-primary bg-primary-light"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </li>
                )}
              </NavLink>
            ))}
          </ul>

          {/* ── Right side ── */}
          <div className="flex items-center gap-3">
            {token && userData ? (
              /* User avatar + hover dropdown */
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors">
                  <img
                    src={userData.image}
                    alt={userData.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown panel — visible on group hover */}
                <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {userData.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {userData.email}
                      </p>
                    </div>
                    <div className="py-1.5">
                      <button
                        onClick={() => navigate("/my-profile")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        My Profile
                      </button>
                      <button
                        onClick={() => navigate("/my-appointment")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        My Appointments
                      </button>
                    </div>
                    <div className="border-t border-gray-50 py-1.5">
                      <button
                        onClick={handleLogOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Guest buttons (desktop only) */
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-gray-600 hover:text-primary px-4 py-2 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="btn-primary text-sm"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setShowMenu(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile backdrop overlay ── */}
      <div
        onClick={() => setShowMenu(false)}
        className={`fixed inset-0 bg-black/40 z-50 md:hidden transition-opacity duration-300 ${
          showMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Mobile slide-over drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 md:hidden flex flex-col shadow-2xl
                    transform transition-transform duration-300 ease-in-out ${
                      showMenu ? "translate-x-0" : "translate-x-full"
                    }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <img className="w-32" src={assets.logo} alt="SwiftCare" />
          <button
            onClick={() => setShowMenu(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Logged-in user identity strip */}
        {token && userData && (
          <div className="flex items-center gap-3 px-5 py-4 bg-primary-light border-b border-primary/10">
            <img
              src={userData.image}
              alt={userData.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {userData.name}
              </p>
              <p className="text-xs text-gray-500">Patient</p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <ul className="flex flex-col px-4 py-4 gap-1 flex-1 overflow-y-auto">
          {NAV_LINKS.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setShowMenu(false)}
            >
              {({ isActive }) => (
                <li
                  className={`px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                    isActive
                      ? "text-primary bg-primary-light"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </li>
              )}
            </NavLink>
          ))}
          {token && (
            <>
              <li
                onClick={() => {
                  navigate("/my-profile");
                  setShowMenu(false);
                }}
                className="px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                My Profile
              </li>
              <li
                onClick={() => {
                  navigate("/my-appointment");
                  setShowMenu(false);
                }}
                className="px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                My Appointments
              </li>
            </>
          )}
        </ul>

        {/* Bottom action buttons */}
        <div className="px-4 pb-6 pt-2 border-t border-gray-100">
          {token ? (
            <button
              onClick={() => {
                handleLogOut();
                setShowMenu(false);
              }}
              className="w-full py-3 rounded-full text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border border-red-100"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="btn-outline w-full text-center text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="btn-primary w-full text-center text-sm"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
