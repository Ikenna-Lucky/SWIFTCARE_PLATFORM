import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Allappointment from "./pages/Admin/Allappointment";
import Adddoctor from "./pages/Admin/Adddoctor";
import Doctorslist from "./pages/Admin/Doctorslist";
import { DoctorContext } from "./context/DoctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  if (!aToken && !dToken) {
    return (
      <>
        <Login />
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      {/* Sidebar is fixed — main content offset by sidebar width */}
      <Sidebar />
      <main className="ml-0 md:ml-64 pt-16 p-6 min-h-screen">
        <Routes>
          <Route path="/" element={<></>} />
          {/* Admin routes */}
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointment" element={<Allappointment />} />
          <Route path="/add-doctor" element={<Adddoctor />} />
          <Route path="/doctor-list" element={<Doctorslist />} />
          {/* Doctor routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/doctor-appointment" element={<DoctorAppointment />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
