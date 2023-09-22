import { 
  BrowserRouter as Router, 
  Routes, 
  Route } from 'react-router-dom';
import "./App.css";
import TopNavBar from "./components/navbarC/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import ResponsiveBreakpointsExample from "./components/tabla/tabla";

import Administrador from './pages/Administradores/administradores';


import { ProtectedRoutes } from './components/ProtectRoutes';
import { useState } from 'react';
const numbers = [3454, 3455, 34545];
function App() {
  return (
    <Router className='App'>
      <TopNavBar />
    <Routes>
    <Route path='/  Login' element={<h1>edfwe</h1>} />
      {/*
      <Route element={<ProtectedRoutes isAllowed={!!user}/>}> */ }
      <Route path='/Cierre' element={<ResponsiveBreakpointsExample dinero={numbers} />} />
      <Route path='/ventas' element={<h1>ventas</h1>} />
      <Route path='/clientes' element={<h1>Clientes</h1>} />
      <Route path='/productos' element={<h1>Productos</h1>} />
      <Route path='/inventario' element={<h1>Inventario</h1>} />
      <Route path='/config' element={<h1>Configuración</h1>} />
 {/*     </Route> */ }
      {/*   <Route element={<ProtectedRoutes isAllowed={!!user && user.rol ==true}/>} redirecTo="/" > */ }

      <Route path='/Administradores' element={<Administrador />} /> 
      <Route path='/Administradores' element={<h1>Administradores </h1>} /> 
 {/*     </Route> */ }
      
    </Routes>
  </Router>
  );
}

export default App;
