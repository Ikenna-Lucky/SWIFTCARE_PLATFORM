import React, { useContext } from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointment from "./pages/MyAppointment";
import Appointment from "./pages/Appointment";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PaymentVerify from "./pages/PaymentVerify";
import VerifyEmail from "./pages/VerifyEmail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import NotFound from "./pages/NotFound";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UnverifiedBanner = () => {
  const { token, userData } = useContext(AppContext);
  if (!token || !userData || userData.isVerified) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-center gap-3 text-sm text-amber-800">
      <svg
        className="w-4 h-4 text-amber-500 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
      <span>
        Please verify your email to book appointments. Check your inbox for the
        verification link.
      </span>
    </div>
  );
};

/**
 * App shell:
 *  - Navbar is sticky full-width (handles its own horizontal padding internally)
 *  - Main content area has the horizontal padding
 *  - key={location.key} on <main> remounts the element on every navigation,
 *    replaying the page-enter fade animation without needing a separate wrapper
 *  - Footer is full-width (dark background edge-to-edge)
 */
const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        toastClassName="text-sm font-medium"
      />

      <Navbar />
      <UnverifiedBanner />

      <main key={location.key} className="flex-1 mx-4 sm:mx-[10%] page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-appointment" element={<MyAppointment />} />
          <Route path="/appointment/:docId" element={<Appointment />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/payment-verify" element={<PaymentVerify />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default App;
