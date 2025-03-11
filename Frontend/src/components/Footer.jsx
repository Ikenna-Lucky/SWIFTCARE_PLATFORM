import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* Left section */}
        <div>
          <img className="mb-5 w-[130px]" src={assets.logo} alt="" />
          <p className="w-full md:2/3 text-gray-600 leading-6">
            Prescripto Hospital truly exemplifies compassionate and cutting-edge
            healthcare. From the moment you step through the doors, a sense of
            calm and efficiency prevails. The staff, from the receptionists to
            the nurses and doctors, are not only highly skilled but also
            genuinely caring and attentive.
          </p>
        </div>
        {/* Center section */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        {/* Right section */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+234 916 286 5922</li>
            <li>goodluckikenna215@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Copyright text */}
      <hr />
      <p className="py-5 text-sm text-center">Copyright 2025@ Prescripto - All Right Reserved</p>
    </div>
  );
};

export default Footer;
