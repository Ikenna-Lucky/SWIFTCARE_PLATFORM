import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

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
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
    <p className="text-sm font-medium">No doctors added yet</p>
    <p className="text-xs mt-1">Add a doctor to get started.</p>
  </div>
);

const ToggleSwitch = ({ checked, onChange }) => (
  <label className="toggle-switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <div className="toggle-track">
      <div className="toggle-thumb" />
    </div>
  </label>
);

const Doctorslist = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) getAllDoctors();
  }, [aToken]);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Doctors</h1>
        <span className="text-sm text-slate-400 font-medium">
          {doctors.length} registered
        </span>
      </div>

      {doctors.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <EmptyState />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
            >
              {/* Photo */}
              <div className="aspect-square bg-gradient-to-br from-teal-50 to-slate-100 overflow-hidden relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Availability dot */}
                <div
                  className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ring-2 ring-white ${doctor.available ? "bg-emerald-400" : "bg-slate-300"}`}
                />
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {doctor.name}
                </p>
                <p className="text-xs text-teal-600 font-medium truncate mt-0.5">
                  {doctor.speciality}
                </p>

                {/* Availability toggle */}
                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`text-xs font-medium ${doctor.available ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {doctor.available ? "Available" : "Off"}
                  </span>
                  <ToggleSwitch
                    checked={doctor.available}
                    onChange={() => changeAvailability(doctor._id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctorslist;
