import React from 'react';
import { useAuth } from '../hooks/useAuth'; 
import { Navigate, Outlet } from 'react-router-dom';
import FullScreenLoader from '../components/common/FullScreenLoader'; 

export const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />; 
  }

  return <Outlet />;
};