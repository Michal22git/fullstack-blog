import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react'
import AuthContext from '../context/AuthContex';

const PrivateRoute = () => {
    let { user } = useContext(AuthContext)

    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;