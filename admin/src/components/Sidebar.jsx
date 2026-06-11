import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_admin/assets";
import { DoctorContext } from "../context/DoctorContext";

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      isActive
        ? "flex items-center gap-3 pl-5 pr-4 py-2.5 text-sm font-semibold text-teal-700 bg-teal-50 border-l-2 border-teal-600 transition-colors"
        : "flex items-center gap-3 pl-5 pr-4 py-2.5 mx-0 text-sm font-medium text-slate-600 border-l-2 border-transparent hover:bg-slate-100 hover:text-slate-900 transition-colors"
    }
  >
    <img src={icon} alt="" className="w-5 h-5 opacity-70 shrink-0" />
    <span className="hidden md:block">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <aside className="fixed top-16 left-0 bottom-0 z-20 w-16 md:w-64 bg-white border-r border-slate-200 overflow-y-auto">
      <nav className="py-4 flex flex-col gap-0.5">
        {aToken && (
          <>
            <p className="hidden md:block px-5 pt-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Admin
            </p>
            <NavItem
              to="/admin-dashboard"
              icon={assets.home_icon}
              label="Dashboard"
            />
            <NavItem
              to="/all-appointment"
              icon={assets.appointments_icon}
              label="Appointments"
            />
            <NavItem
              to="/add-doctor"
              icon={assets.add_icon}
              label="Add Doctor"
            />
            <NavItem
              to="/doctor-list"
              icon={assets.people_icon}
              label="Doctors List"
            />
          </>
        )}

        {dToken && (
          <>
            <p className="hidden md:block px-5 pt-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Doctor
            </p>
            <NavItem
              to="/doctor-dashboard"
              icon={assets.home_icon}
              label="Dashboard"
            />
            <NavItem
              to="/doctor-appointment"
              icon={assets.appointments_icon}
              label="Appointments"
            />
            <NavItem
              to="/doctor-profile"
              icon={assets.people_icon}
              label="My Profile"
            />
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
