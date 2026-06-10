import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointment from "./pages/MyAppointment";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        toastClassName="text-sm font-medium"
      />

      {/* Sticky navbar — full width, own internal padding */}
      <Navbar />

      {/* Page content — horizontally padded, fades in on each navigation */}
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
          {/* Catch-all — must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Full-width dark footer */}
      <Footer />

      {/* Floating scroll-to-top button — appears after scrolling 300px */}
      <ScrollToTopButton />
    </div>
  );
};

export default App;
