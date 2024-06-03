import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const accessToken = localStorage.getItem('accessToken');

  return accessToken ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
