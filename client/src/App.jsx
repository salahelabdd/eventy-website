import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/admin/Users";
import Navbar from "./components/Navbar";
import VenueDetails from "./pages/VenueDetails";
import BookingPage from "./pages/BookingPage";
import EditProfile from "./pages/EditProfile";
import MyReservations from "./pages/MyReservations";
import AdminBookings from "./pages/admin/bookings";
import AdminDashboard from "./pages/admin/admindashboard";
import ForgotPassword from "./pages/ForgotPassword";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import HotelBookingPage from "./pages/HotelBookingPage";
import AdminHotelReservations from "./pages/admin/AdminHotelReservation";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { applyTheme } from "./utils/themeUtils";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    applyTheme();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/booking" element={<Booking />} /> */}
      <Route path="/admin/users" element={<Users />} />
      <Route path="/navbar" element={<Navbar />} />
      <Route path="/venue/:id" element={<VenueDetails />} />
      <Route path="/booking/:id" element={<BookingPage />} />
      <Route path="/update-profile" element={<EditProfile />} />
      <Route path="/my-reservations" element={<MyReservations />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="/admin/admindashboard" element={<AdminDashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/services" element={<Services />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/hotel/:id" element={<HotelBookingPage />} />{" "}
      <Route
        path="/admin/hotel-reservations"
        element={<AdminHotelReservations />}
      />
      <Route path="/provider" element={<ProviderDashboard />} />
    </Routes>
  );
}

export default App;
