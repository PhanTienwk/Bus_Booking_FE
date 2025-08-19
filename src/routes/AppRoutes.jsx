import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext"; // Import từ AuthContext.js
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
import UserManagement from "../Page/Admin/UserManagement";
import DriverManagement from "../Page/Admin/DriverManagement";
import LocationManagement from "../Page/Admin/LocationManagement";
import RouteManagement from "../Page/Admin/RouteManagement";
import Statistic from "../Page/Admin/Statistic";
import InvoiceManagement from "../Page/Admin/InvoiceManagement";
import TripManagement from "../Page/Admin/TripManagement";
import UserInformation from "../Page/Admin/UserInformation";
import DriverPage from "../Page/Driver/DriverPage";
import TicketCancelManage from "../Page/Admin/TicketCancelManage";
import ForgotPassword from "../Page/User/ForgotPassword";
import ConsultTicket from "../Page/User/ConsultTicket";
import ConsultInvoice from "../Page/User/ConsultInvoice";
import "../tailwind.css";

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/consult-ticket" element={<ConsultTicket />} />
          <Route path="/consult-invoice" element={<ConsultInvoice />} />


          <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'DRIVER']} />}>
            <Route path="/bus-routes" element={<BusRoutePage />} />
            <Route path="/seat-selection/:tripId" element={<SeatSelectionPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/thankyou" element={<ThankYouPage />} />
            <Route path="/profile" element={<InforUserPage />} />
            <Route path="/history-ticket" element={<HistoryTicketPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<UserManagement />} />
            <Route path="/admin/driver" element={<DriverManagement />} />
            <Route path="/admin/invoice" element={<InvoiceManagement />} />
            <Route path="/admin/route" element={<RouteManagement />} />
            <Route path="/admin/trip" element={<TripManagement />} />
            <Route path="/admin/bus-station" element={<BusStaion />} />
            <Route path="/admin/location" element={<LocationManagement />} />
            <Route path="/admin/statistic" element={<Statistic />} />
            <Route path="/admin/information" element={<UserInformation />} />
            <Route path="/admin/ticket-cancel-manage" element={<TicketCancelManage />} />
          </Route>

          
          <Route element={<ProtectedRoute allowedRoles={['DRIVER']} />}>
            <Route path="/driver" element={<DriverPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};


export default AppRoutes;