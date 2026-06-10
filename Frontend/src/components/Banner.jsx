import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
import useInView from "../hooks/useInView";

const Banner = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [textRef, textInView] = useInView();
  const [imgRef, imgInView] = useInView();

  return (
    <section className="relative bg-primary rounded-3xl overflow-hidden my-10">
      {/* Decorative circles for depth */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center">
        {/* ── Text side — slides in from left ── */}
        <div
          ref={textRef}
          className={`flex-1 px-8 md:px-14 py-12 md:py-16 z-10 reveal-left ${textInView ? "is-visible" : ""}`}
        >
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
            SwiftCare Platform
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Book Appointments
            <span className="block text-white/80 mt-1">
              With 100+ Trusted Doctors
            </span>
          </h2>
          <p className="text-white/70 text-sm mt-4 mb-8 max-w-md leading-relaxed">
            Join thousands of patients who use SwiftCare to find the right
            doctor and schedule appointments in minutes.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            {token ? (
              <button
                onClick={() => {
                  navigate("/doctors");
                  window.scrollTo(0, 0);
                }}
                className="bg-white text-primary px-8 py-3 rounded-full font-semibold text-sm hover:bg-primary-light transition-colors duration-200 shadow-lg hover:scale-105 transform"
              >
                Find a Doctor Now
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    window.scrollTo(0, 0);
                  }}
                  className="bg-white text-primary px-8 py-3 rounded-full font-semibold text-sm hover:bg-primary-light transition-all duration-200 shadow-lg hover:scale-105 transform"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => {
                    navigate("/login");
                    window.scrollTo(0, 0);
                  }}
                  className="border border-white/40 text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-white/10 transition-colors"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Image side — slides in from right (desktop only) ── */}
        <div
          ref={imgRef}
          className={`hidden md:block w-[320px] lg:w-[360px] flex-shrink-0 self-end reveal-right ${imgInView ? "is-visible" : ""}`}
          style={{ transitionDelay: "120ms" }}
        >
          <img
            className="w-full object-contain object-bottom"
            src={assets.appointment_img}
            alt="Book an appointment"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
