import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import "./tabla.css";

function ResponsiveBreakpointsExample(props, user) {
  const [dinero, setDinero] = useState([
    props.dinero[0],
    props.dinero[1],
    props.dinero[2],
  ]);
  console.log(user)
  return (
    <div>
      <h4>Corte de fecha de hoy</h4>
    <div id="pantalla">
      <div id="tabla">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th colSpan={2}>Entradas de Efectivo </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Entrada de dinero</td>
              <td>${dinero[0]+dinero[1]}</td>
            </tr>
            <tr>
              <td>Dinero inicial</td>
              <td>${dinero[1]}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>${dinero[2]}</td>
            </tr>
          </tbody>
        </Table>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th colSpan={2}>Dinero en Caja </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Efectivo</td>
              <td>${dinero[0]}</td>
            </tr>
            <tr>
              <td>Tarjeta de debito o credito</td>
              <td>${dinero[1]}</td>
            </tr>
            <tr>
              <td>SINPE</td>
              <td>${dinero[2]}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>${dinero[2]}</td>
            </tr>
          </tbody>
        </Table>
        <Table striped bordered hover size="sm">
          <tbody>
          <tr>
              <td><button> Abonos</button></td>
              <td>${dinero[0]+dinero[1]}</td>
            </tr>
            <tr>
              <td>Pago a proveedores</td>
              <td>${dinero[1]}</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div id="columna2">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th colSpan={2}>Pagos de Contado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ventas en efectivo</td>
              <td>${dinero[0]}</td>
            </tr>
            <tr>
              <td>Entradas</td>
              <td>${dinero[1]}</td>
            </tr>
            <tr>
              <td>Pago a proveedores</td>
              <td>${dinero[2]}</td>
            </tr>
          </tbody>
        </Table>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th colSpan={2}>Ventas por Departamento</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Articulos varios</td>
              <td>${dinero[0]}</td>
            </tr>
            <tr>
              <td>departamento 1</td>
              <td>${dinero[1]}</td>
            </tr>
            <tr>
              <td>departamento 2</td>
              <td>${dinero[2]}</td>
            </tr>
            <tr>
              <td>departamento 3</td>
              <td>${dinero[2]}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
    <div id="resumen">
    <h3>Ventas Totales: ${dinero[2]}</h3>
    <h3>Ganancia del día: ${dinero[2]}</h3>
    </div>
    </div>
  );
}
export default ResponsiveBreakpointsExample;
