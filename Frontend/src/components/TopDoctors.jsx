import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCard from "./DoctorCard";
import useInView from "../hooks/useInView";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const [headingRef, headingInView] = useInView();
  const [gridRef, gridInView] = useInView();

  return (
    <section className="py-20">
      {/* Section header — fades up on scroll */}
      <div
        ref={headingRef}
        className={`reveal flex items-end justify-between mb-10 ${headingInView ? "is-visible" : ""}`}
      >
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Our Doctors
          </p>
          <h2 className="section-title">Top Doctors to Book</h2>
          <p className="section-subtitle mt-2 max-w-sm">
            Verified and experienced doctors ready to help you.
          </p>
        </div>
        {/* Desktop "View all" link */}
        <button
          onClick={() => {
            navigate("/doctors");
            window.scrollTo(0, 0);
          }}
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          View all
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
        </button>
      </div>

      {/* Doctor grid or empty state */}
      {doctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-2xl">
          <svg
            className="w-12 h-12 mb-3 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-sm">No doctors available at the moment.</p>
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
        >
          {doctors.slice(0, 10).map((doctor, index) => (
            /* Each card fades up with a staggered delay */
            <div
              key={doctor._id}
              className={`reveal ${gridInView ? "is-visible" : ""}`}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      )}

      {/* Mobile "View all" button */}
      <div className="text-center mt-10 sm:hidden">
        <button
          onClick={() => {
            navigate("/doctors");
            window.scrollTo(0, 0);
          }}
          className="btn-outline text-sm"
        >
          View All Doctors
        </button>
      </div>
    </section>
  );
};

export default TopDoctors;
