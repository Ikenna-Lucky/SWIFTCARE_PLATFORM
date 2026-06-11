import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";
import axios from "axios";

const InfoRow = ({ label, children }) => (
  <div>
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
      {label}
    </p>
    {children}
  </div>
);

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  const updateProfile = async () => {
    setSaving(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/updatedoc-profile",
        {
          address: profileData.address,
          fees: profileData.fees,
          available: profileData.available,
        },
        { headers: { dToken } },
      );
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!profileData) return null;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">My Profile</h1>
        {!isEdit && (
          <button
            onClick={() => setIsEdit(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-teal-700 text-teal-700 hover:bg-teal-50 transition-colors font-medium"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 right-20 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute top-4 left-32 w-16 h-16 rounded-full bg-white/5" />

          {/* Status badge in banner */}
          <div className="absolute top-4 right-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${profileData.available ? "bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/30" : "bg-slate-500/20 text-slate-200 ring-1 ring-slate-400/30"}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${profileData.available ? "bg-emerald-300" : "bg-slate-400"}`}
              />
              {profileData.available ? "Accepting Patients" : "Not Available"}
            </span>
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="-mt-14 mb-4">
            <img
              src={profileData.image}
              alt={profileData.name}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
          </div>

          {/* Name + meta */}
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-slate-800">
              {profileData.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm text-teal-700 font-semibold">
                {profileData.speciality}
              </span>
              <span className="text-slate-300">&middot;</span>
              <span className="text-sm text-slate-500">
                {profileData.degree}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                {profileData.experience}
              </span>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="flex gap-6 py-4 border-y border-slate-100 my-6">
            <div className="text-center">
              <p className="text-lg font-bold text-teal-700">
                ${profileData.fees}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Per Visit</p>
            </div>
            <div className="w-px bg-slate-100" />
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">
                {profileData.experience}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Experience</p>
            </div>
          </div>

          {/* About */}
          <div className="mb-6">
            <InfoRow label="About">
              <p className="text-sm text-slate-600 leading-relaxed">
                {profileData.about}
              </p>
            </InfoRow>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Consultation Fee */}
            <InfoRow label="Consultation Fee">
              {isEdit ? (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-sm">$</span>
                  <input
                    type="number"
                    className="admin-input w-32"
                    value={profileData.fees}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                  />
                </div>
              ) : (
                <p className="text-lg font-bold text-slate-800">
                  ${profileData.fees}
                </p>
              )}
            </InfoRow>

            {/* Availability */}
            <InfoRow label="Availability">
              {isEdit ? (
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={profileData.available}
                      onChange={() =>
                        setProfileData((prev) => ({
                          ...prev,
                          available: !prev.available,
                        }))
                      }
                    />
                    <div className="toggle-track">
                      <div className="toggle-thumb" />
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium ${profileData.available ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {profileData.available
                      ? "Available for bookings"
                      : "Not accepting patients"}
                  </span>
                </label>
              ) : (
                <span
                  className={
                    profileData.available
                      ? "badge-completed"
                      : "badge-cancelled"
                  }
                >
                  {profileData.available ? "Available" : "Unavailable"}
                </span>
              )}
            </InfoRow>

            {/* Address */}
            <div className="sm:col-span-2">
              <InfoRow label="Clinic Address">
                {isEdit ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Line 1"
                      value={profileData.address.line1}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                    />
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Line 2 (optional)"
                      value={profileData.address.line2}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">
                    {profileData.address.line1}
                    {profileData.address.line2 && (
                      <>
                        <br />
                        {profileData.address.line2}
                      </>
                    )}
                  </p>
                )}
              </InfoRow>
            </div>
          </div>

          {/* Edit actions */}
          {isEdit && (
            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={updateProfile}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEdit(false);
                  getProfileData();
                }}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
