import React from 'react';
import {useLogin} from '../Contexts/LoginAuth';
import {Navigate} from 'react-router-dom';

const RutaPrivada = ({children}) => {
	const {user} = useLogin();
    
    return user ? <>{children}</> : <Navigate to="/" />;
  
}

export default RutaPrivada