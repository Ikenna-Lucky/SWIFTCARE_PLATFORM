import React, { useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { toast } from "react-toastify";

const CONTACT_INFO = [
  {
    iconPath:
      "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    label: "Office Address",
    value: "Hilltop Trans Station, Suite C30-32, Gwarimpa, Abuja, Nigeria",
  },
  {
    iconPath:
      "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    label: "Phone",
    value: "+234 916 286 5922",
  },
  {
    iconPath:
      "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "Email",
    value: "support@swiftcare.com",
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Simulated submission — wire up to a real endpoint when ready
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", message: "" });
    setIsSending(false);
  };

  return (
    <div className="py-8">
      {/* ── Page header ── */}
      <div className="text-center mb-14">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
          Contact
        </p>
        <h1 className="text-4xl font-bold text-gray-900">Get In Touch</h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          Have a question or need help? We're here for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-20">
        {/* ── Left: Image + contact info + careers ── */}
        <div className="flex flex-col gap-8">
          <img
            src={assets.contact_image}
            alt="Contact SwiftCare"
            className="w-full rounded-3xl object-cover shadow-lg max-h-64 md:max-h-none"
          />

          {/* Contact info rows */}
          <div className="flex flex-col gap-5">
            {CONTACT_INFO.map(({ iconPath, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={iconPath}
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-sm text-gray-700 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Careers CTA */}
          <div className="bg-primary-light border border-primary/10 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-1">
              Careers at SwiftCare
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Interested in joining our mission to transform healthcare access
              in Nigeria?
            </p>
            <button className="btn-primary text-sm">Explore Open Roles</button>
          </div>
        </div>

        {/* ── Right: Contact form ── */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
                rows={5}
                className="input-field resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className={`w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                isSending
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark shadow-md"
              }`}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
