import React, { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import useInView from "../hooks/useInView";

/* ─── Data ───────────────────────────────────────────────────────────── */

const STATS = [
  { end: 100, suffix: "+", label: "Verified Doctors" },
  { end: 50, suffix: "K+", label: "Patients Served" },
  { end: 6, suffix: "+", label: "Specialities" },
  { end: 4.9, suffix: "★", label: "Average Rating", decimals: 1 },
];

const WHY_CHOOSE_US = [
  {
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Fast & Efficient",
    description:
      "Book appointments in under 2 minutes. No phone calls, no waiting rooms — just instant scheduling that fits your lifestyle.",
  },
  {
    iconPath:
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Verified Doctors",
    description:
      "Every doctor on SwiftCare is credentialed and verified. You get access to qualified, experienced specialists you can trust.",
  },
  {
    iconPath:
      "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    title: "Personalized Care",
    description:
      "Tailored doctor recommendations, full appointment history, and timely reminders — all in one easy-to-use platform.",
  },
];

/* ─── CountUp component ──────────────────────────────────────────────── */

/**
 * Animates a number from 0 to `end` once `start` flips to true.
 * Uses requestAnimationFrame for a smooth, GPU-friendly animation.
 */
const CountUp = ({ end, suffix = "", decimals = 0, start }) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    const duration = 1400; // ms
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(end);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, end, decimals]);

  return (
    <>
      {decimals > 0 ? value.toFixed(decimals) : Math.floor(value)}
      {suffix}
    </>
  );
};

/* ─── Page component ─────────────────────────────────────────────────── */

const About = () => {
  const [headerRef, headerInView] = useInView();
  const [imgRef, imgInView] = useInView();
  const [textRef, textInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [whyRef, whyInView] = useInView();
  const [tilesRef, tilesInView] = useInView();

  return (
    <div className="py-8">
      {/* ── Page header ── */}
      <div
        ref={headerRef}
        className={`text-center mb-14 reveal ${headerInView ? "is-visible" : ""}`}
      >
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
          About SwiftCare
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Healthcare Made <span className="text-primary">Simple</span>
        </h1>
        <p className="text-gray-500 mt-3 max-w-lg mx-auto leading-relaxed">
          We're on a mission to make quality healthcare accessible to everyone.
        </p>
      </div>

      {/* ── Story section — image from left, text from right ── */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <img
          ref={imgRef}
          src={assets.about_image}
          alt="About SwiftCare"
          className={`w-full rounded-3xl object-cover shadow-lg reveal-left ${imgInView ? "is-visible" : ""}`}
        />
        <div
          ref={textRef}
          className={`flex flex-col gap-6 reveal-right ${textInView ? "is-visible" : ""}`}
          style={{ transitionDelay: "80ms" }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Who We Are
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              SwiftCare is a digital health platform designed to close the gap
              between patients and quality healthcare. We understand how hard it
              can be to find the right doctor, schedule a visit, and keep track
              of your medical appointments — so we built a smarter way to do all
              of it.
            </p>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our platform connects you with verified, experienced doctors across
            multiple specialities. Whether you need a general check-up or a
            specialist consultation, SwiftCare makes it fast, simple, and
            stress-free.
          </p>
          {/* Vision callout */}
          <div className="bg-primary-light border border-primary/10 rounded-2xl p-6">
            <p className="text-sm font-semibold text-primary mb-2">
              Our Vision
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              To empower every individual to take control of their health by
              providing seamless access to trusted healthcare professionals —
              fostering a more informed, engaged, and healthier society.
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats row — CountUp animates when cards enter viewport ── */}
      <div
        ref={statsRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
      >
        {STATS.map(({ end, suffix, label, decimals = 0 }, index) => (
          <div
            key={label}
            className={`card p-6 text-center reveal ${statsInView ? "is-visible" : ""}`}
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <p className="text-3xl font-bold text-primary">
              <CountUp
                end={end}
                suffix={suffix}
                decimals={decimals}
                start={statsInView}
              />
            </p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Why choose us ── */}
      <div className="mb-10">
        <div
          ref={whyRef}
          className={`text-center mb-10 reveal ${whyInView ? "is-visible" : ""}`}
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Why SwiftCare
          </p>
          <h2 className="section-title">Why Patients Choose Us</h2>
        </div>

        <div
          ref={tilesRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {WHY_CHOOSE_US.map(({ iconPath, title, description }, index) => (
            <div
              key={title}
              className={`card p-6 lg:p-8 hover:border-primary/20 transition-all duration-300 group reveal ${tilesInView ? "is-visible" : ""}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon tile — fills with primary on hover */}
              <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300"
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
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
