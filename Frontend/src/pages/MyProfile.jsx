import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * A single labelled row in the profile info grid.
 * Renders the edit component when in edit mode, or the plain value otherwise.
 */
const InfoRow = ({ label, value, editComponent }) => (
  <div className="flex flex-col sm:grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 py-3.5 border-b border-gray-50 last:border-0">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="text-sm text-gray-800">
      {editComponent ?? <span>{value || "—"}</span>}
    </div>
  </div>
);

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setImage(null);
    // Reload from server to discard any unsaved local state changes
    loadUserProfileData();
  };

  // Loading state
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="card p-6 sm:p-8">
        {/* ── Avatar + Name ── */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
          {/* Avatar — clickable to change in edit mode */}
          <div className="relative flex-shrink-0">
            {isEdit ? (
              <label
                htmlFor="profile-image"
                className="cursor-pointer group block"
              >
                <img
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-light"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  hidden
                />
              </label>
            ) : (
              <img
                src={userData.image}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-light"
              />
            )}
          </div>

          {/* Name (editable in edit mode) */}
          <div className="flex-1 min-w-0">
            {isEdit ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input-field text-lg font-bold"
              />
            ) : (
              <p className="text-xl font-bold text-gray-900 truncate">
                {userData.name}
              </p>
            )}
            <p className="text-sm text-gray-400 mt-0.5 truncate">
              {userData.email}
            </p>
          </div>
        </div>

        {/* ── Contact information ── */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Contact Information
          </p>
          <InfoRow label="Email" value={userData.email} />
          <InfoRow
            label="Phone"
            value={userData.phone}
            editComponent={
              isEdit ? (
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="input-field"
                />
              ) : null
            }
          />
          <InfoRow
            label="Address"
            value={
              [userData.address.line1, userData.address.line2]
                .filter(Boolean)
                .join(", ") || "—"
            }
            editComponent={
              isEdit ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Address line 1"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Address line 2 (optional)"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    className="input-field"
                  />
                </div>
              ) : null
            }
          />
        </div>

        {/* ── Basic information ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Basic Information
          </p>
          <InfoRow
            label="Gender"
            value={userData.gender !== "Not Selected" ? userData.gender : "—"}
            editComponent={
              isEdit ? (
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  className="input-field max-w-xs"
                >
                  <option value="Not Selected">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : null
            }
          />
          <InfoRow
            label="Date of Birth"
            value={userData.dob !== "Not Selected" ? userData.dob : "—"}
            editComponent={
              isEdit ? (
                <input
                  type="date"
                  value={userData.dob === "Not Selected" ? "" : userData.dob}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  className="input-field max-w-xs"
                />
              ) : null
            }
          />
        </div>

        {/* ── Action buttons ── */}
        <div className="flex items-center gap-3">
          {isEdit ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isSaving
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="btn-outline text-sm"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
