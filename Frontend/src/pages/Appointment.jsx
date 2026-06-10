import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Appointment = () => {
  const navigate = useNavigate();
  const { docId } = useParams();
  const { doctors, currencySymbol, token, backendUrl, getDoctorsData } =
    useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // Resolve doctor from shared context
  useEffect(() => {
    const found = doctors.find((doc) => doc._id === docId);
    setDocInfo(found ?? null);
  }, [doctors, docId]);

  // Build 7-day slot grid once doctor data is ready
  useEffect(() => {
    if (!docInfo) return;

    const slots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const current = new Date(today);
      current.setDate(today.getDate() + i);

      const endOfDay = new Date(today);
      endOfDay.setDate(today.getDate() + i);
      endOfDay.setHours(21, 0, 0, 0);

      // For today, start from the next hour; for future days start at 10:00
      if (i === 0) {
        current.setHours(current.getHours() > 10 ? current.getHours() + 1 : 10);
        current.setMinutes(current.getMinutes() > 30 ? 30 : 0);
      } else {
        current.setHours(10, 0, 0, 0);
      }

      const daySlots = [];
      while (current < endOfDay) {
        const formattedTime = current.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const slotDate = `${current.getDate()}_${current.getMonth() + 1}_${current.getFullYear()}`;
        const alreadyBooked =
          docInfo.slots_booked[slotDate]?.includes(formattedTime);

        if (!alreadyBooked) {
          daySlots.push({ datetime: new Date(current), time: formattedTime });
        }
        current.setMinutes(current.getMinutes() + 30);
      }

      slots.push(daySlots);
    }

    setDocSlots(slots);
  }, [docInfo]);

  const handleBookAppointment = async () => {
    if (!token) {
      toast.warn("Please log in to book an appointment");
      return navigate("/login");
    }
    if (!slotTime) {
      toast.warn("Please select a time slot first");
      return;
    }

    setIsBooking(true);
    try {
      const date = docSlots[slotIndex][0]?.datetime;
      if (!date) {
        toast.error("No available slots for this day");
        return;
      }

      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointment");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  // ── Loading / not-found state ──
  if (!docInfo) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Loading doctor information…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* ── Doctor profile card ── */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        {/* Photo */}
        <div className="sm:w-60 flex-shrink-0">
          <img
            src={docInfo.image}
            alt={docInfo.name}
            className="w-full sm:w-60 h-64 object-cover object-top rounded-2xl bg-primary-light"
          />
        </div>

        {/* Details */}
        <div className="flex-1 card p-6 sm:p-8">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {docInfo.name}
                </h1>
                <img
                  src={assets.verified_icon}
                  alt="Verified"
                  className="w-5 h-5"
                />
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap text-sm text-gray-600">
                <span>{docInfo.degree}</span>
                <span className="text-gray-300">•</span>
                <span className="font-medium text-primary">
                  {docInfo.speciality}
                </span>
                <span className="border border-gray-200 text-gray-500 px-2.5 py-0.5 rounded-full text-xs">
                  {docInfo.experience}
                </span>
              </div>
            </div>
            {/* Availability pill */}
            <div
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
                docInfo.available
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-gray-100 text-gray-500 border border-gray-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${docInfo.available ? "bg-green-500" : "bg-gray-400"}`}
              />
              {docInfo.available ? "Available" : "Unavailable"}
            </div>
          </div>

          {/* About section */}
          <div className="mt-5">
            <div className="flex items-center gap-1.5 mb-2">
              <img src={assets.info_icon} alt="" className="w-4" />
              <p className="text-sm font-semibold text-gray-700">About</p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {docInfo.about}
            </p>
          </div>

          {/* Appointment fee */}
          <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">Appointment Fee</span>
            <span className="text-xl font-bold text-primary">
              {currencySymbol}
              {docInfo.fees}
            </span>
          </div>
        </div>
      </div>

      {/* ── Slot booking panel ── */}
      <div className="card p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Select an Appointment Slot
        </h2>

        {/* Day picker */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
          {docSlots.map((daySlots, index) => {
            const date = daySlots[0]?.datetime;
            const hasSlots = daySlots.length > 0;
            return (
              <button
                key={index}
                onClick={() => {
                  setSlotIndex(index);
                  setSlotTime("");
                }}
                disabled={!hasSlots}
                className={`flex flex-col items-center min-w-[72px] py-4 px-3 rounded-2xl transition-all duration-200 flex-shrink-0 ${
                  slotIndex === index
                    ? "bg-primary text-white shadow-md"
                    : hasSlots
                      ? "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-primary-light hover:text-primary"
                      : "bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100"
                }`}
              >
                <span className="text-xs font-medium">
                  {date ? DAYS_OF_WEEK[date.getDay()] : "—"}
                </span>
                <span className="text-xl font-bold mt-0.5">
                  {date ? date.getDate() : "—"}
                </span>
                <span className="text-xs mt-0.5 opacity-70">
                  {hasSlots ? `${daySlots.length} left` : "Full"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time slot picker */}
        {docSlots[slotIndex]?.length > 0 ? (
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Available Times
            </p>
            <div className="flex flex-wrap gap-2">
              {docSlots[slotIndex].map((slot, index) => (
                <button
                  key={index}
                  onClick={() => setSlotTime(slot.time)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    slot.time === slotTime
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-50 text-gray-600 border border-gray-100 hover:border-primary hover:text-primary"
                  }`}
                >
                  {slot.time.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-4 text-center bg-gray-50 rounded-xl mb-6">
            No available slots for this day
          </p>
        )}

        {/* Confirm button — disabled until a time is selected */}
        <button
          onClick={handleBookAppointment}
          disabled={isBooking || !slotTime}
          className={`flex items-center justify-center gap-2 px-10 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 ${
            isBooking || !slotTime
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg"
          }`}
        >
          {isBooking ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Booking…
            </>
          ) : (
            "Confirm Appointment"
          )}
        </button>
      </div>

      {/* Related doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
