import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import "./App.css";
import TopNavBar from "./components/navbarC/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import ResponsiveBreakpointsExample from "./components/tabla/tabla";

import PerfilM from './pages/Perfil/perfil';
import Api from './pages/Producto/Target-api';
import Producto from './pages/Producto/Productos';
import Departamentos from './pages/departamentos/departamentos';
import { ProtectedRoutes } from './components/ProtectRoutes';
import ObtenerFB from './components/Movimientos/obtenerFB';
import { useState } from 'react';
import Clientes from './pages/clientes/cliente';
import Pedidos from './pages/Pedidos/pedidos';
import Factura from './pages/Facturacion/Facturacion';
import Apartado from './pages/Apartados/Apartado';
import Login from './pages/login/Login';
import Cortes from './pages/Cortes/Cortes';
import HistorialFactura from './pages/historialFacturas/HistorialFactura';

import { Switch } from 'react-router-dom';
import HistorialSalida from './components/Movimientos/HistorialSalida';
import Usuarios from './pages/login/Login';
import CortesInfo from './components/tabla/tabla';
import CorteInicio from './components/tabla/InicioCorte';
const numbers = [3454, 3455, 34545];
function App() {
  return (
    <Router className='App'>
      
      <Routes>
       <Route path='/' element={<Usuarios />} />
        {/*
      <Route element={<ProtectedRoutes isAllowed={!!user}/>}> */ }
        <Route path='/Cierre' element={<ResponsiveBreakpointsExample dinero={numbers} />} />
        <Route path='/Ventas' element={<h1>Ventas</h1>} />
        <Route path='/Clientes' element={<Clientes />} />
        <Route path='/Productos' element={<Producto />} />
        <Route path='/Config' element={<PerfilM />} />
        <Route path='/Productos/Api' element={<Api />} />
        {/*     </Route> */}
        {/*   <Route element={<ProtectedRoutes isAllowed={!!user && user.rol ==true}/>} redirecTo="/" > */}
        <Route path='/Departamentos' element={<Departamentos />} />
        <Route path='/Administradores' element={<h1>Administradores </h1>} />
        <Route path='/HistorialSalida' element={<HistorialSalida />} />
        <Route path='/Facturacion' element={<Factura />} />
        <Route path='/pedidos' element={<Pedidos />} />
        <Route path='/obtenerFB' element={<ObtenerFB />} />
        <Route path='/Apartados' element={<Apartado />} />
        <Route path='/historial' element={<HistorialFactura />} />
        <Route path='/cortes' element={<Cortes />} />
        <Route path='/IC' element={<CorteInicio />} />
        <Route path='/Cierre' element={<CortesInfo />} />
    

        {/*     </Route> */}

      </Routes>
    </Router>

  );
}

export default App;
