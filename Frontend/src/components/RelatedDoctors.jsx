import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import DoctorCard from "./DoctorCard";

/**
 * Shows up to 5 other doctors in the same speciality.
 * Returns null (renders nothing) when there are no matches.
 */
const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const [relatedDocs, setRelatedDocs] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const filtered = doctors
        .filter((doc) => doc.speciality === speciality && doc._id !== docId)
        .slice(0, 5);
      setRelatedDocs(filtered);
    }
  }, [doctors, speciality, docId]);

  // Nothing to show — don't render the section at all
  if (relatedDocs.length === 0) return null;

  return (
    <section className="py-10">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Related Doctors</h2>
        <p className="text-sm text-gray-500 mt-1">
          Other {speciality} specialists you may consider
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {relatedDocs.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </section>
  );
};

export default RelatedDoctors;
