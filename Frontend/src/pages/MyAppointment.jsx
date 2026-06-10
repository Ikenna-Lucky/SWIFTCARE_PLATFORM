import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MONTHS = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Converts "D_M_YYYY" slot date into a readable "D Mon YYYY" string */
const formatSlotDate = (slotDate) => {
  const [day, month, year] = slotDate.split("_");
  return `${day} ${MONTHS[Number(month)]} ${year}`;
};

/** Converts "D_M_YYYY" to a timestamp for sorting */
const slotDateToTimestamp = (slotDate) => {
  const [day, month, year] = slotDate.split("_").map(Number);
  return new Date(year, month - 1, day).getTime();
};

/** Maps appointment state to a display label + Tailwind classes */
const getStatus = (appt) => {
  if (appt.cancelled)
    return {
      label: "Cancelled",
      style: "bg-red-50 text-red-600 border border-red-200",
    };
  if (appt.isCompleted)
    return {
      label: "Completed",
      style: "bg-green-50 text-green-700 border border-green-200",
    };
  if (appt.payment)
    return {
      label: "Paid",
      style: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    };
  return {
    label: "Upcoming",
    style: "bg-blue-50 text-blue-600 border border-blue-200",
  };
};

/* ─── Reusable appointment card ─────────────────────────────────────── */

const AppointmentCard = ({ appt, onCancel, cancellingId }) => {
  const { label, style } = getStatus(appt);
  const isUpcoming = !appt.cancelled && !appt.isCompleted;

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Doctor photo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-primary-light flex-shrink-0">
          <img
            src={appt.docData.image}
            alt={appt.docData.name}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Appointment details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="font-semibold text-gray-900 text-base">
                {appt.docData.name}
              </p>
              <p className="text-primary text-sm">{appt.docData.speciality}</p>
            </div>
            {/* Status badge */}
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${style}`}
            >
              {label}
            </span>
          </div>

          {/* Meta: date, time, address */}
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
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
              {formatSlotDate(appt.slotDate)}
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {appt.slotTime}
            </div>
            {appt.docData.address?.line1 && (
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                {appt.docData.address.line1}
              </div>
            )}
          </div>
        </div>

        {/* Cancel button — only for upcoming (not yet cancelled/completed) */}
        {isUpcoming && (
          <div className="flex sm:flex-col gap-2 items-start sm:items-end justify-end flex-shrink-0">
            <button
              onClick={() => onCancel(appt._id)}
              disabled={cancellingId === appt._id}
              className="text-xs font-medium px-4 py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancellingId === appt._id ? "Cancelling…" : "Cancel"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Tab button ─────────────────────────────────────────────────────── */

const Tab = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative pb-3 text-sm font-medium transition-colors focus:outline-none ${
      active ? "text-primary" : "text-gray-400 hover:text-gray-600"
    }`}
  >
    <span className="flex items-center gap-2">
      {label}
      {count > 0 && (
        <span
          className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-semibold ${
            active ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          {count}
        </span>
      )}
    </span>
    {/* Active underline indicator */}
    <span
      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200 ${
        active ? "bg-primary" : "bg-transparent"
      }`}
    />
  </button>
);

/* ─── Empty state ────────────────────────────────────────────────────── */

const EmptyState = ({ tab, onNavigate }) => (
  <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl text-gray-400">
    <svg
      className="w-14 h-14 mb-4 opacity-30"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    {tab === "upcoming" ? (
      <>
        <p className="text-base font-medium text-gray-500">
          No upcoming appointments
        </p>
        <p className="text-sm mt-1 mb-6">
          Book your next appointment with a SwiftCare doctor.
        </p>
        <button onClick={onNavigate} className="btn-primary text-sm">
          Find a Doctor
        </button>
      </>
    ) : (
      <>
        <p className="text-base font-medium text-gray-500">
          No past appointments
        </p>
        <p className="text-sm mt-1">
          Your completed and cancelled appointments will appear here.
        </p>
      </>
    )}
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────── */

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to load appointments. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    setCancellingId(appointmentId);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        fetchAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to cancel appointment. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  // Split into two groups.
  // Upcoming: not cancelled and not completed — sorted soonest first.
  // Past: cancelled or completed — sorted most recent first.
  const upcoming = appointments
    .filter((a) => !a.cancelled && !a.isCompleted)
    .sort(
      (a, b) =>
        slotDateToTimestamp(a.slotDate) - slotDateToTimestamp(b.slotDate),
    );

  const past = appointments
    .filter((a) => a.cancelled || a.isCompleted)
    .sort(
      (a, b) =>
        slotDateToTimestamp(b.slotDate) - slotDateToTimestamp(a.slotDate),
    );

  const displayed = activeTab === "upcoming" ? upcoming : past;

  const handleNavigate = () => {
    navigate("/doctors");
    window.scrollTo(0, 0);
  };

  return (
    <div className="py-8">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          {!isLoading && (
            <p className="text-sm text-gray-500 mt-1">
              {appointments.length} total appointment
              {appointments.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <button
          onClick={handleNavigate}
          className="btn-primary text-sm hidden sm:block"
        >
          Book New
        </button>
      </div>

      {/* ── Loading skeletons ── */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        /* ── Fully empty state (no appointments at all) ── */
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl text-gray-400">
          <svg
            className="w-14 h-14 mb-4 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-base font-medium text-gray-500">
            No appointments yet
          </p>
          <p className="text-sm mt-1 mb-6">
            Book your first appointment with a SwiftCare doctor.
          </p>
          <button onClick={handleNavigate} className="btn-primary text-sm">
            Find a Doctor
          </button>
        </div>
      ) : (
        <>
          {/* ── Tabs ── */}
          <div className="flex gap-6 border-b border-gray-100 mb-6">
            <Tab
              label="Upcoming"
              count={upcoming.length}
              active={activeTab === "upcoming"}
              onClick={() => setActiveTab("upcoming")}
            />
            <Tab
              label="Past"
              count={past.length}
              active={activeTab === "past"}
              onClick={() => setActiveTab("past")}
            />
          </div>

          {/* ── Tab content ── */}
          {displayed.length === 0 ? (
            <EmptyState tab={activeTab} onNavigate={handleNavigate} />
          ) : (
            <div className="flex flex-col gap-4">
              {displayed.map((appt) => (
                <AppointmentCard
                  key={appt._id}
                  appt={appt}
                  onCancel={handleCancel}
                  cancellingId={cancellingId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyAppointment;
