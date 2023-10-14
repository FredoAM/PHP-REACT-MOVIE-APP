import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {Movie, Header, Search, Login, SignUp, PrivateRoute, RutaPrivada, Perfil} from './components'
import {MoviesProvider} from './Contexts/MoviesContext.jsx';
import { AuthProvider } from './Contexts/LoginAuth.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MoviesProvider>
          <Header/>
          <Routes>
            <Route exact path="/" Component={App}> </Route>
            <Route path="/:mediaType/:id" Component={Movie}> </Route>
            <Route
                path="/Perfil"
                element={
                  <RutaPrivada>
                    <Perfil/>
                  </RutaPrivada>
                }
              />
            <Route path="/Search/query/:query" Component={Search}> </Route>
            <Route
              path="/Login"
              element={
                <PrivateRoute>
                  <Login/>
                </PrivateRoute>
              }
            />
            <Route
              path="/SignUp"
              element={
                <PrivateRoute>
                  <SignUp/>
                </PrivateRoute>
              }
            />
          </Routes>
        </MoviesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
