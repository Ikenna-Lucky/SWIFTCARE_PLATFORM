import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCard from "../components/DoctorCard";

/**
 * Single source of truth for speciality names.
 * Used both for filter buttons and display — no more copy-pasted strings.
 */
const SPECIALITIES = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

/** Skeleton placeholder shown while the doctor list is loading from the API */
const DoctorCardSkeleton = () => (
  <div className="card p-4 animate-pulse">
    {/* Avatar area */}
    <div className="h-48 sm:h-52 rounded-xl bg-gray-100 mb-4" />
    {/* Name */}
    <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-2" />
    {/* Speciality */}
    <div className="h-3 bg-gray-100 rounded-full w-1/2 mb-3" />
    {/* Availability pill */}
    <div className="h-3 bg-gray-100 rounded-full w-1/3" />
  </div>
);

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");

  // Re-apply filter whenever the URL param, search query, or doctor list changes
  useEffect(() => {
    let result = doctors;

    // 1 — speciality filter (from URL param)
    if (speciality) {
      result = result.filter((doc) => doc.speciality === speciality);
    }

    // 2 — live name search (case-insensitive, trims whitespace)
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((doc) => doc.name.toLowerCase().includes(query));
    }

    setFilterDoc(result);
  }, [speciality, doctors, search]);

  const handleSpecialityClick = (spec) => {
    // Clicking the active filter clears it (toggle behaviour)
    navigate(speciality === spec ? "/doctors" : `/doctors/${spec}`);
    window.scrollTo(0, 0);
  };

  // Determine whether we're still waiting for the initial API response
  const isLoading = doctors.length === 0;

  return (
    <div className="py-8">
      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find a Doctor</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isLoading ? (
            "Loading available doctors…"
          ) : (
            <>
              {filterDoc.length} doctor{filterDoc.length !== 1 ? "s" : ""}{" "}
              available
              {speciality ? ` · ${speciality}` : ""}
              {search.trim() ? ` · "${search.trim()}"` : ""}
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* ── Filter sidebar ── */}
        <aside className="sm:w-52 flex-shrink-0">
          {/* Mobile toggle button */}
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className={`sm:hidden flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors mb-4 ${
              showFilter
                ? "bg-primary text-white border-primary"
                : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
            }`}
          >
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Filter list — always visible on desktop, toggleable on mobile */}
          <div className={`${showFilter ? "block" : "hidden"} sm:block`}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 hidden sm:block">
              Speciality
            </p>
            <div className="flex flex-col gap-1">
              {/* "All" option */}
              <button
                onClick={() => {
                  navigate("/doctors");
                  window.scrollTo(0, 0);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  !speciality
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                }`}
              >
                All Doctors
              </button>

              {/* Speciality options — derived from the SPECIALITIES constant */}
              {SPECIALITIES.map((spec) => (
                <button
                  key={spec}
                  onClick={() => handleSpecialityClick(spec)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    speciality === spec
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Doctor grid ── */}
        <div className="flex-1 min-w-0">
          {/* Live search input */}
          <div className="relative mb-5">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor name…"
              className="input-field pl-10 pr-10"
            />
            {/* Clear button — only shown when there's a query */}
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Loading skeletons — shown until the first API response arrives */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <DoctorCardSkeleton key={i} />
              ))}
            </div>
          ) : filterDoc.length === 0 ? (
            /* Empty state — no results after filtering/searching */
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
              <p className="text-sm font-medium">No doctors found</p>
              {search.trim() ? (
                <button
                  onClick={() => setSearch("")}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Clear search
                </button>
              ) : (
                <p className="text-xs mt-1">
                  Try a different speciality or check back later.
                </p>
              )}
            </div>
          ) : (
            /* Loaded doctor grid */
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filterDoc.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
