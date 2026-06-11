import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_admin/assets";

const StatCard = ({ icon, value, label, accent, textAccent }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}
    >
      <img src={icon} alt={label} className="w-6 h-6" />
    </div>
    <div>
      <p className={`text-2xl font-bold ${textAccent ?? "text-slate-800"}`}>
        {value ?? 0}
      </p>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-0.5">
        {label}
      </p>
    </div>
  </div>
);

const CancelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-14 text-slate-400">
    <svg
      className="w-10 h-10 mb-3 opacity-40"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <p className="text-sm">{message}</p>
  </div>
);

const Dashboard = () => {
  const { dashData, getDashData, aToken, cancelAppointmentByAdmin } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken]);

  if (!dashData) return null;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="max-w-6xl">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">{greeting}</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Here's what's happening with SwiftCare today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={assets.doctor_icon}
          value={dashData.doctors}
          label="Total Doctors"
          accent="bg-teal-50"
          textAccent="text-teal-700"
        />
        <StatCard
          icon={assets.appointments_icon}
          value={dashData.appointment}
          label="Appointments"
          accent="bg-blue-50"
          textAccent="text-blue-700"
        />
        <StatCard
          icon={assets.patients_icon}
          value={dashData.patients}
          label="Patients"
          accent="bg-violet-50"
          textAccent="text-violet-700"
        />
      </div>

      {/* Latest bookings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <img src={assets.list_icon} alt="" className="w-4 h-4 opacity-50" />
            <h2 className="text-sm font-semibold text-slate-700">
              Latest Bookings
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {dashData.latestAppointments.length} recent
          </span>
        </div>

        {dashData.latestAppointments.length === 0 ? (
          <EmptyState message="No bookings yet." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {dashData.latestAppointments.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <img
                  src={item.docData.image}
                  alt={item.docData.name}
                  className="w-10 h-10 rounded-full object-cover bg-slate-100 ring-2 ring-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {item.docData.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {slotDateFormat(item.slotDate)} &middot; {item.slotTime}
                  </p>
                </div>
                {item.cancelled ? (
                  <span className="badge-cancelled">Cancelled</span>
                ) : item.isCompleted ? (
                  <span className="badge-completed">Completed</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="badge-pending mr-2">Pending</span>
                    <button
                      onClick={() => cancelAppointmentByAdmin(item._id)}
                      className="btn-icon-cancel"
                      title="Cancel appointment"
                    >
                      <CancelIcon />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
