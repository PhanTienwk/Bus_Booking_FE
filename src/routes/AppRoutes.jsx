import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import HomePage from "../Page/User/HomePage";
import LoginPage from "../Page/User/LoginPage";
import BusRoutePage from "../Page/User/BusRoutePage";
import SeatSelectionPage from "../Page/User/SeatSelectionPage";
import CheckoutPage from "../Page/User/CheckoutPage";
import ThankYouPage from "../Page/User/ThankYouPage";
import InforUserPage from "../Page/User/InforUserPage";
import HistoryTicketPage from "../Page/User/HistoryTicketPage";
import ChangePasswordPage from "../Page/User/ChangePasswordPage";
import BusStaion from "../Page/Admin/BusStation";
import AdminPage from "../Page/Admin/AdminPage";

import "../tailwind.css";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/bus-routes" element={<BusRoutePage />} />
        <Route path="/seat-selection" element={<SeatSelectionPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/infor-user" element={<InforUserPage />} />
        <Route path="/history-ticket" element={<HistoryTicketPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/bus-station" element={<BusStaion />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
