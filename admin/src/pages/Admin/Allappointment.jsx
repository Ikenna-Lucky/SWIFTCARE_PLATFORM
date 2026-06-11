import React, { useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

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

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
    <svg
      className="w-12 h-12 mb-3 opacity-30"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
    <p className="text-sm font-medium">No appointments found</p>
    <p className="text-xs mt-1">Appointments will appear here once booked.</p>
  </div>
);

const Allappointment = () => {
  const { getAllAppointments, aToken, appointments, cancelAppointmentByAdmin } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">
          All Appointments
        </h1>
        <span className="text-sm text-slate-400 font-medium">
          {appointments.length} total
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>#</span>
          <span>Patient</span>
          <span>Age</span>
          <span>Date &amp; Time</span>
          <span>Doctor</span>
          <span>Fees</span>
          <span>Status</span>
        </div>

        {appointments.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="divide-y divide-slate-100">
            {appointments.map((item, index) => (
              <li
                key={item._id}
                className="flex flex-wrap sm:grid sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors text-sm text-slate-600"
              >
                <span className="hidden sm:block text-slate-400 text-xs">
                  {index + 1}
                </span>

                {/* Patient */}
                <div className="flex items-center gap-2">
                  <img
                    src={item.userData.image}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover bg-slate-100 shrink-0 ring-1 ring-slate-200"
                  />
                  <span className="font-medium text-slate-800 truncate">
                    {item.userData.name}
                  </span>
                </div>

                <span className="hidden sm:block text-slate-500">
                  {calculateAge(item.userData.dob)}
                </span>

                <span className="text-slate-600">
                  {slotDateFormat(item.slotDate)}
                  <br />
                  <span className="text-xs text-slate-400">
                    {item.slotTime}
                  </span>
                </span>

                {/* Doctor */}
                <div className="flex items-center gap-2">
                  <img
                    src={item.docData.image}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover bg-slate-100 shrink-0 ring-1 ring-slate-200"
                  />
                  <span className="truncate">{item.docData.name}</span>
                </div>

                <span className="font-semibold text-slate-800">
                  ${item.amount}
                </span>

                {/* Status / action */}
                {item.cancelled ? (
                  <span className="badge-cancelled">Cancelled</span>
                ) : item.isCompleted ? (
                  <span className="badge-completed">Completed</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="badge-pending">Pending</span>
                    <button
                      onClick={() => cancelAppointmentByAdmin(item._id)}
                      className="btn-icon-cancel"
                      title="Cancel"
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

export default Allappointment;
