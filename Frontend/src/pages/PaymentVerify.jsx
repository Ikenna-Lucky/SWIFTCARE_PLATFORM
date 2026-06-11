import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const PaymentVerify = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!reference) {
      setStatus("failed");
      return;
    }
    const verify = async () => {
      try {
        const { data } = await axios.post(
          backendUrl + "/api/user/verify-payment",
          { reference },
          { headers: { token } }
        );
        setStatus(data.success ? "success" : "failed");
      } catch {
        setStatus("failed");
      }
    };
    verify();
  }, [reference, token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          {status === "loading" && (
            <>
              <div className="w-16 h-16 border-4 border-teal-100 border-t-primary rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying payment...</h2>
              <p className="text-gray-500 text-sm">Please wait while we confirm your payment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-9 h-9 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment successful!</h2>
              <p className="text-gray-500 text-sm mb-8">
                Your appointment has been confirmed and paid. A confirmation email has been sent to you.
              </p>
              <Link to="/my-appointment" className="btn-primary px-8 py-3">
                View my appointments
              </Link>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-9 h-9 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment failed</h2>
              <p className="text-gray-500 text-sm mb-8">
                We could not verify your payment. If money was deducted, please contact support.
              </p>
              <Link to="/my-appointment" className="btn-primary px-8 py-3">
                Back to appointments
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentVerify;
