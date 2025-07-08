import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from 'react';
import HomePage from '../Page/User/HomePage';
import HomePage1 from '../Page/User/HomePage1';
import HomePage2 from '../Page/User/HomePage2';
import HomePage3 from '../Page/User/HomePage3';
import HomePage4 from '../Page/User/HomePage4';
import HomePage5 from '../Page/User/HomePage5';
import HomePage6 from '../Page/User/HomePage6';
import HomePage7 from '../Page/User/HomePage7';
import HomePage8 from '../Page/User/HomePage8';

import AdminPage from '../Page/Admin/AdminPage';

import '../tailwind.css';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<HomePage1 />} />
        <Route path="/busroute" element={<HomePage2 />} />
        <Route path="/ticket" element={<HomePage3 />} />
        <Route path="/checkout" element={<HomePage4 />} />
        <Route path="/thankyou" element={<HomePage5 />} />
        <Route path="/in4" element={<HomePage6 />} />
        <Route path="/history" element={<HomePage7 />} />
        <Route path="/changepass" element={<HomePage8 />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
