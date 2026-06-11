import React, { useContext } from "react";
import { assets } from "../assets/assets_admin/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const formatDate = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const Navbar = () => {
  const navigate = useNavigate();
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const role = aToken ? "Admin" : "Doctor";

  const logout = () => {
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Logo + role badge */}
      <div className="flex items-center gap-3">
        <img
          src={assets.admin_logo}
          alt="SwiftCare"
          className="h-8 w-auto cursor-pointer"
          onClick={() =>
            navigate(aToken ? "/admin-dashboard" : "/doctor-dashboard")
          }
        />
        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          {role}
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Date */}
        <span className="hidden md:block text-xs text-slate-400 font-medium">
          {formatDate()}
        </span>

        {/* Role avatar */}
        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
          <span className="text-xs font-bold text-teal-700">{role[0]}</span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
