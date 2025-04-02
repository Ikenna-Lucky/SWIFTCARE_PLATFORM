import React from "react";
// import groupProfile from "../assets/assets_frontend/group_profiles.png";
import arrow_icon from "../assets/assets_frontend/arrow_icon.svg";
import header_img from "../assets/assets_frontend/header_img.png";
import { assets } from "../assets/assets_frontend/assets";
const Header = () => {
  return (
    <div className="flex flex-col max-md:place-items-center md:flex-row bg-primary gap-x-20 rounded-lg px-6 md:px-10 lg:px-20">
      {/* left side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] max-md:place-items-center">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight max-md:text-center">
          Book Appointment<br /> with credentialed Doctors
        </p>
        <div className="flex flex-col md:flex-row items-center gap-2 text-white text-sm font-light">
          <img className="w-28" src={assets.group_profiles} />
          <p>
            Simply browse through our extensive list of trusted doctors,{" "}
            <br className="hidden sm:block" />
            schedule your appointment hassle-free.
          </p>
        </div>
        <a
          href="#speciality"
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300"
        >
          Book appointment <img className="w-3" src={arrow_icon} alt="" />
        </a>
      </div>
      {/* Right side */}
      <div className=" max-md:w-3/4 md:w-2/5 relative">
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
          src={assets.doc_header}
          alt=""
        />
      </div>
    </div>
  );
};

export default Header;
