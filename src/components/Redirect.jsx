import React from 'react';
import {useLogin} from './../Contexts/LoginAuth';
import {Navigate} from 'react-router-dom';

function PrivateRoute({ children }) {
    const {user} = useLogin();
    
    return user ? <Navigate to="/" /> : <>{children}</>;
  }

export default PrivateRoute