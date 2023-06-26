import React, { useContext, useState, useEffect } from 'react';

// Creamos el contexto;
const AuthContext = React.createContext();

// Hook para acceder al contexto
const useLogin =  () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext, useLogin};