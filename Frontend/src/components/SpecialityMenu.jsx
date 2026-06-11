import React from "react";
import { specialityData } from "../assets/assets_frontend/assets";
import { Link } from "react-router-dom";
import useInView from "../hooks/useInView";

const SpecialityMenu = () => {
  // Heading and tiles share the same viewport trigger
  const [headingRef, headingInView] = useInView();
  const [listRef, listInView] = useInView();

  return (
    <section className="py-20" id="speciality">
      {/* Section heading — fades up when it enters the viewport */}
      <div
        ref={headingRef}
        className={`text-center mb-10 reveal ${headingInView ? "is-visible" : ""}`}
      >
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
          Browse by Speciality
        </p>
        <h2 className="section-title">Find the Right Specialist</h2>
        <p className="section-subtitle max-w-sm mx-auto mt-2">
          Browse our network of trusted, verified doctors across all major
          medical specialities.
        </p>
      </div>

      {/* Speciality tiles — staggered fade-up */}
      <div
        ref={listRef}
        className="flex gap-5 justify-start sm:justify-center overflow-x-auto pb-3 px-2"
      >
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            onClick={() => window.scrollTo(0, 0)}
            className={`reveal group flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer ${listInView ? "is-visible" : ""}`}
            style={{ transitionDelay: `${index * 70}ms` }}
          >
            {/* Icon tile */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary-light border border-primary/10 flex items-center justify-center group-hover:bg-primary transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <img
                className="w-10 sm:w-12 group-hover:brightness-0 group-hover:invert transition-all duration-300"
                src={item.image}
                alt={item.speciality}
              />
            </div>
            <p className="text-xs font-medium text-gray-600 group-hover:text-primary transition-colors text-center max-w-[80px]">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SpecialityMenu;
