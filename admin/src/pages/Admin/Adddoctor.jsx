import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const SPECIALITIES = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

const EXPERIENCE_OPTIONS = Array.from({ length: 10 }, (_, i) =>
  i === 0 ? "1 Year" : `${i + 1} Years`,
);

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
      {children}
    </span>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

const Adddoctor = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState(SPECIALITIES[0]);
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setDocImg(null);
    setName("");
    setEmail("");
    setPassword("");
    setAddress1("");
    setAddress2("");
    setDegree("");
    setAbout("");
    setFees("");
    setExperience("1 Year");
    setSpeciality(SPECIALITIES[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!docImg) return toast.error("Please select a profile image.");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", fees);
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 }),
      );

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success(data.message);
        resetForm();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Add Doctor</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Fill in the details below to register a new doctor.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-8"
      >
        {/* Avatar upload */}
        <div>
          <SectionTitle>Profile Photo</SectionTitle>
          <div className="flex items-center gap-5">
            <label htmlFor="doc-img" className="cursor-pointer group">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 group-hover:border-teal-400 transition-colors overflow-hidden flex items-center justify-center bg-slate-50">
                {docImg ? (
                  <img
                    src={URL.createObjectURL(docImg)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={assets.upload_area}
                      alt="Upload"
                      className="w-8 h-8 opacity-30"
                    />
                    <span className="text-xs text-slate-400">Upload</span>
                  </div>
                )}
              </div>
            </label>
            <input
              id="doc-img"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => setDocImg(e.target.files[0] || null)}
            />
            <div>
              <p className="text-sm font-medium text-slate-700">
                {docImg ? docImg.name : "No file selected"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                JPEG, PNG or WebP &middot; Max 5 MB
              </p>
              {docImg && (
                <button
                  type="button"
                  onClick={() => setDocImg(null)}
                  className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Account details */}
        <div>
          <SectionTitle>Account Details</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Field label="Full Name">
              <input
                className="admin-input"
                type="text"
                placeholder="Dr. Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>
            <Field label="Email Address">
              <input
                className="admin-input"
                type="email"
                placeholder="doctor@swiftcare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Password">
              <input
                className="admin-input"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
          </div>
        </div>

        {/* Professional info */}
        <div>
          <SectionTitle>Professional Info</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Field label="Speciality">
              <select
                className="admin-input"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                {SPECIALITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Education / Degree">
              <input
                className="admin-input"
                type="text"
                placeholder="e.g. MBBS, MD"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </Field>
            <Field label="Experience">
              <select
                className="admin-input"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Consultation Fee ($)">
              <input
                className="admin-input"
                type="number"
                min="0"
                placeholder="e.g. 80"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
              />
            </Field>
          </div>
        </div>

        {/* Address */}
        <div>
          <SectionTitle>Clinic Address</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Field label="Address Line 1">
              <input
                className="admin-input"
                type="text"
                placeholder="Street address"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
              />
            </Field>
            <Field label="Address Line 2 (optional)">
              <input
                className="admin-input"
                type="text"
                placeholder="Suite, floor, etc."
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </Field>
          </div>
        </div>

        {/* About */}
        <div>
          <SectionTitle>About</SectionTitle>
          <Field label="Doctor Bio">
            <textarea
              className="admin-input resize-none"
              rows={4}
              placeholder="Brief background, specialisations, approach to patient care..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              required
            />
          </Field>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Doctor"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Adddoctor;
