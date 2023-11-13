import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "./tabla.css";
import {Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc,addDoc } from "firebase/firestore";

function ResponsiveBreakpointsExample() {
  const db = getFirestore(appPVH);
  const [departamento, setDepartamento] = useState([]);
  const [apartado, setApartado] = useState([]);
  const [producto, setProducto] = useState([]);
  const [sumaD, setSuma] = useState([]);

  useEffect(() => {sumarValor()}, []);

  const sumarValor = () => {
    obtenerApartado();
    console.log("Datos obtenidos:", apartado);
    const suma = apartado.reduce((total, apartadoItem) => {
      return total + (apartadoItem.Saldo || 0);
    }, 0);
    setSuma(suma);
    console.log("La suma total es:", suma);
  };
  const departamentoMasVendido = async()=>{

  }
  const obtenerDepartamentos = async () => {
    try {
      const userRef = collection(db, "Departamento");
      const userSnapshot = await getDocs(userRef);
      const allD = userSnapshot.docs
        .map((departament) => departament.data())
        setDepartamento(allD);
    } catch (error) {
      console.error("Error al obtener departamentos: ", error);
    }
  };
  const obtenerProducto = async () => {
    try {
      const userRef = collection(db, "Producto");
      const userSnapshot = await getDocs(userRef);
      const all = userSnapshot.docs
        .map((departament) => departament.data())
        setProducto(all);
    } catch (error) {
      console.error("Error al obtener Producto: ", error);
    }
  };
  const obtenerApartado = async () => {
    try {
      const userRef = collection(db, "Apartado");
      const userSnapshot = await getDocs(userRef);
      const allApartados = userSnapshot.docs
        .map((product) => product.data());
        setApartado(allApartados);
    } catch (error) {
      console.error("Error al obtener apartado: ", error);
    }
  };
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
              <td>₡</td>
            </tr>
            <tr>
              <td>Dinero inicial</td>
              <td>₡</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>₡</td>
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
              <td>₡</td>
            </tr>
            <tr>
              <td>Tarjeta de debito o credito</td>
              <td>₡</td>
            </tr>
            <tr>
              <td>SINPE</td>
              <td>₡</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>₡</td>
            </tr>
          </tbody>
        </Table>
        <Table striped bordered hover size="sm">
          <tbody>
            <tr>
              <td>Pago a proveedores</td>
              <td>₡</td>
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
              <td>₡</td>
            </tr>
            <tr>
              <td>Entradas</td>
              <td>₡</td>
            </tr>
            <tr>
              <td>Pago a proveedores</td>
              <td>₡</td>
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
              <td>₡</td>
            </tr>
            <tr>
              <td>departamento 1</td>
              <td>₡</td>
            </tr>
            <tr>
              <td>departamento 2</td>
              <td>₡</td>
            </tr>
            <tr>
              <td>departamento 3</td>
              <td>₡</td>
            </tr>
          </tbody>
        </Table>
        <h3>Deuda total de los clientes: ₡{sumaD}</h3>
      </div>
    </div>
    <div id="resumen">
    <h3>Ventas Totales: ₡</h3>
    <h3>Ganancia del día: ₡</h3>
    </div>
    </div>
  );
}
export default ResponsiveBreakpointsExample;
