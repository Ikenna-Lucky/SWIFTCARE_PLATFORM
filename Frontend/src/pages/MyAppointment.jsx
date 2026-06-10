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

const formatSlotDate = (slotDate) => {
  const [day, month, year] = slotDate.split("_");
  return `${day} ${MONTHS[Number(month)]} ${year}`;
};

const slotDateToTimestamp = (slotDate) => {
  const [day, month, year] = slotDate.split("_").map(Number);
  return new Date(year, month - 1, day).getTime();
};

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

const AppointmentCard = ({ appt, onCancel, onPay, cancellingId, payingId }) => {
  const { label, style } = getStatus(appt);
  const isActive = !appt.cancelled && !appt.isCompleted;
  const isPaid = appt.payment;

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

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="font-semibold text-gray-900 text-base">
                {appt.docData.name}
              </p>
              <p className="text-primary text-sm">{appt.docData.speciality}</p>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${style}`}
            >
              {label}
            </span>
          </div>

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
                <span className="truncate">{appt.docData.address.line1}</span>
              </div>
            )}
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium text-gray-700">${appt.amount}</span>
            </div>
          </div>

          {/* Actions */}
          {isActive && (
            <div className="flex items-center gap-3 mt-4">
              {!isPaid && (
                <button
                  onClick={() => onPay(appt._id)}
                  disabled={payingId === appt._id}
                  className="btn-primary px-5 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {payingId === appt._id ? "Redirecting..." : "Pay Now"}
                </button>
              )}
              <button
                onClick={() => onCancel(appt._id)}
                disabled={cancellingId === appt._id}
                className="px-5 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {cancellingId === appt._id ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message, sub }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-gray-400"
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
    </div>
    <p className="text-gray-700 font-medium">{message}</p>
    {sub && <p className="text-gray-400 text-sm mt-1">{sub}</p>}
  </div>
);

const MyAppointment = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        setAppointments([...data.appointments].reverse());
      }
    } catch (err) {
      toast.error("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    } else {
      navigate("/login");
    }
  }, [token]);

  const handleCancel = async (appointmentId) => {
    setCancellingId(appointmentId);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        fetchAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const handlePay = async (appointmentId) => {
    setPayingId(appointmentId);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/initialize-payment",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        window.location.href = data.authorization_url;
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPayingId(null);
    }
  };

  const now = Date.now();
  const upcoming = appointments.filter(
    (a) =>
      !a.cancelled &&
      !a.isCompleted &&
      slotDateToTimestamp(a.slotDate) >= now - 86400000,
  );
  const past = appointments.filter(
    (a) =>
      a.cancelled ||
      a.isCompleted ||
      slotDateToTimestamp(a.slotDate) < now - 86400000,
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 page-enter">
        <div className="h-8 bg-gray-200 rounded-xl w-48 mb-8 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 mb-4 animate-pulse">
            <div className="flex gap-5">
              <div className="w-24 h-24 rounded-2xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded-lg w-40" />
                <div className="h-4 bg-gray-100 rounded-lg w-28" />
                <div className="h-4 bg-gray-100 rounded-lg w-56" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 page-enter">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
      <p className="text-gray-500 mb-8">
        {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}{" "}
        total
      </p>

      {appointments.length === 0 ? (
        <div className="card">
          <EmptyState
            message="No appointments yet"
            sub="Book your first appointment with one of our doctors."
          />
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Upcoming ({upcoming.length})
              </h2>
              <div className="space-y-4">
                {upcoming.map((appt) => (
                  <AppointmentCard
                    key={appt._id}
                    appt={appt}
                    onCancel={handleCancel}
                    onPay={handlePay}
                    cancellingId={cancellingId}
                    payingId={payingId}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Past / completed */}
          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Past ({past.length})
              </h2>
              <div className="space-y-4">
                {past.map((appt) => (
                  <AppointmentCard
                    key={appt._id}
                    appt={appt}
                    onCancel={handleCancel}
                    onPay={handlePay}
                    cancellingId={cancellingId}
                    payingId={payingId}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default MyAppointment;
