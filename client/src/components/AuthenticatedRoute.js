import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = ({ children, redirectTo }) => {
  const isAuthenticated = localStorage.getItem('token')

  return isAuthenticated ? (
    <Outlet /> 
  ) : (
    <Navigate to={redirectTo} replace /> 
  );
};
