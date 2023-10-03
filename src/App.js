import { 
  BrowserRouter as Router, 
  Routes, 
  Route } from 'react-router-dom';
import "./App.css";
import TopNavBar from "./components/navbarC/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import ResponsiveBreakpointsExample from "./components/tabla/tabla";
import Salidas from './components/Movimientos/Salidas';
import Api from './pages/Producto/Target-api';
import Producto from './pages/Producto/Productos';
import Departamentos from './pages/departamentos/departamentos';
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
      <Route path='/productos' element={<Producto/>} />
      <Route path='/inventario' element={<h1>Inventario</h1>} />
      <Route path='/config' element={<h1>Configuración</h1>} />
      <Route path='/productos/Api' element={<Api />} />
 {/*     </Route> */ }
      {/*   <Route element={<ProtectedRoutes isAllowed={!!user && user.rol ==true}/>} redirecTo="/" > */ }


      <Route path='/departamentos' element={<Departamentos />} />
      <Route path='/Administradores' element={<h1>Administradores </h1>} /> 
      <Route path='/Salidas' element={<Salidas />} />
 {/*     </Route> */ }
      
    </Routes>
  </Router>
  );
}

export default App;
