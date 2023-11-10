import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import "./App.css";
import TopNavBar from "./components/navbarC/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import ResponsiveBreakpointsExample from "./components/tabla/tabla";
import Salidas from './components/Movimientos/Salidas';
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
        <Route path='/Ventas' element={<h1>Ventas</h1>} />
        <Route path='/Clientes' element={<Clientes />} />
        <Route path='/Productos' element={<Producto />} />
        <Route path='/Config' element={<PerfilM />} />
        <Route path='/Productos/Api' element={<Api />} />
        {/*     </Route> */}
        {/*   <Route element={<ProtectedRoutes isAllowed={!!user && user.rol ==true}/>} redirecTo="/" > */}
        <Route path='/Departamentos' element={<Departamentos />} />
        <Route path='/Administradores' element={<h1>Administradores </h1>} />
        <Route path='/Salidas' element={<Salidas />} />
        <Route path='/Facturacion' element={<Factura />} />
        <Route path='/pedidos' element={<Pedidos />} />
        <Route path='/obtenerFB' element={<ObtenerFB />} />
        {/*     </Route> */}

      </Routes>
    </Router>

  );
}

export default App;
