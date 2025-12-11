import React from "react";
import { Navigate } from "react-router-dom";
import { usedata } from "../context/dataContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = usedata();
  
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
};

export default ProtectedRoute;
