import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 

const ProtectedRoute = ({ allowedRoles }) => {
  const { role1, loading } = useContext(AuthContext);
    const role = localStorage.getItem('role');

  if (loading) {
    return <div>Đang kiểm tra quyền truy cập...</div>; 
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
