import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={` flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex "
          }`}
        >
          <p
            onClick={() => {
              navigate("/doctors");
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all duration-500 cursor-pointer hover:text-white hover:bg-primary`}
          >
            All Doctors
          </p>
          <p
            onClick={() => {
              speciality !== "General physician" &&
                navigate("/doctors/General physician");
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all duration-500 cursor-pointer ${
              speciality === "General physician"
                ? "text-black bg-indigo-100"
                : ""
            }`}
          >
            General physician
          </p>
          <p
            onClick={() => {
              speciality !== "Gynecologist" &&
                navigate("/doctors/Gynecologist");
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all duration-500 cursor-pointer ${
              speciality === "Gynecologist" ? "text-black bg-indigo-100" : ""
            }`}
          >
            Gynecologist
          </p>
          <p
            onClick={() => {
              speciality !== "Dermatologist" &&
                navigate("/doctors/Dermatologist");
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all duration-500 cursor-pointer ${
              speciality === "Dermatologist" ? "text-black bg-indigo-100" : ""
            }`}
          >
            Dermatologist
          </p>
          <p
            onClick={() => {
              speciality !== "Pediatricians" &&
                navigate("/doctors/Pediatricians");
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all duration-500 cursor-pointer ${
              speciality === "Pediatricians" ? "text-black bg-indigo-100" : ""
            }`}
          >
            Pediatricians
          </p>
          <p
            onClick={() => {
              speciality !== "Neurologist" && navigate("/doctors/Neurologist");
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all duration-500 cursor-pointer ${
              speciality === "Neurologist" ? "text-black bg-indigo-100" : ""
            }`}
          >
            Neurologist
          </p>
          <p
            onClick={() => {
              speciality !== "Gastroenterologist" &&
                navigate("/doctors/Gastroenterologist");
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all duration-500 cursor-pointer ${
              speciality === "Gastroenterologist"
                ? "text-black bg-indigo-100"
                : ""
            }`}
          >
            Gastroenterologist
          </p>
        </div>
        <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
          {filterDoc.map((item, index) => {
            return (
              <div
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                }}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                key={index}
              >
                <img className="bg-blue-50" src={item.image} alt="" />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-center text-green-500">
                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                    <p>Available</p>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">
                    {item.name}
                  </p>
                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
