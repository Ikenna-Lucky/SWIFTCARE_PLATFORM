import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Reusable doctor card used on: TopDoctors, Doctors page, RelatedDoctors.
 * Keeps card UI consistent and eliminates copy-pasted markup.
 *
 * @param {{ doctor: Object }} props
 */
const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/appointment/${doctor._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="group card cursor-pointer overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]"
    >
      {/* ── Doctor image with fixed height ── */}
      <div className="relative overflow-hidden bg-primary-light h-48 sm:h-52">
        <img
          src={doctor.image}
          alt={`Dr. ${doctor.name}`}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        {/* Availability badge — top-right corner */}
        <div
          className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
            doctor.available
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-gray-50 text-gray-500 border border-gray-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              doctor.available ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {doctor.available ? "Available" : "Unavailable"}
        </div>
      </div>

      {/* ── Doctor info ── */}
      <div className="p-4">
        <p className="font-semibold text-gray-900 text-base leading-snug">
          {doctor.name}
        </p>
        <p className="text-primary text-sm mt-0.5">{doctor.speciality}</p>

        {/* Divider + Book link */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-0.5">
            {/* Static 5-star rating — replace with real data when available */}
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className="w-3 h-3 fill-yellow-400 text-yellow-400"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-xs font-medium text-gray-400 group-hover:text-primary transition-colors">
            Book →
          </span>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
