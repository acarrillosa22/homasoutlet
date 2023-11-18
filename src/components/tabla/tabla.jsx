import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "./tabla.css";
import { Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc, addDoc, orderBy, limit, } from "firebase/firestore";
function ResponsiveBreakpointsExample() {
  const db = getFirestore(appPVH);
  const [departamento, setDepartamento] = useState([]);
  const [producto, setProducto] = useState([]);
  const [movimiento, setMovimiento] = useState([]);
  const [movimientoS, setMovimientoS] = useState([]);
  const [movimientoE, setMovimientoE] = useState([]);
  const [sumaD, setSuma] = useState([]);
  const [efectivo, setEfectivo] = useState([]);
  const [entrada, setEntrada] = useState(0);
  const [targeta, setTargeta] = useState([]);
  const [simpe, setSimpe] = useState([]);
  const [total, setTotal] = useState([]);

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
  const obtenerFactura = async () => {
    try {
      const userRef = collection(db, "Factura");
      const userSnapshot = await getDocs(userRef);
      const allD = userSnapshot.docs.map((factura) => factura.data());

      let totalSimpe = 0;
      let totalTargeta = 0;
      let totalEfectivo = 0;

      allD.forEach((factura) => {
        if (factura.TipoPago === "Simpe") {
          totalSimpe += factura.Total;
        } else if (factura.TipoPago === "Targeta") {
          totalTargeta += factura.Total;
        } else if (factura.TipoPago === "Efectivo") {
          totalEfectivo += factura.Total;
        }
      });

      // Calcula el total general sumando los totales de cada tipo de pago
      const totalGeneral = totalSimpe + totalTargeta + totalEfectivo;

      // Ahora puedes guardar los totales en el estado o hacer lo que necesites con ellos
      setSimpe(totalSimpe);
      setTargeta(totalTargeta);
      setEfectivo(totalEfectivo);
      setTotal(totalGeneral);
    } catch (error) {
      console.error("Error al obtener facturas: ", error);
    }
  };
  const obtenerProducto = async () => {
    try {
      const userRef = collection(db, "Producto");

      // Crear una consulta que ordena los productos por la cantidad vendida en orden descendente y limita a 3 resultados
      const q = query(userRef, orderBy("CantidaVendidos", "desc"), limit(3));

      const userSnapshot = await getDocs(q);

      const all = userSnapshot.docs.map((producto) => producto.data());

      setProducto(all);
    } catch (error) {
      console.error("Error al obtener Producto: ", error);
    }
  };
  
  const obtenerMovimiento = async () => {
    try {
      const userRef = collection(db, "Movimiento");
      const userSnapshot = await getDocs(userRef);
      const all = userSnapshot.docs
        .map((departament) => departament.data())
      setMovimiento(all);

      let totalSalida = 0;
      let totalEntrada = 0;

      all.forEach((factura) => {
        if (factura.Tipo === "Salida") {
          totalSalida += factura.Monto;
        } else if (factura.Tipo === "Entrada") {
          totalEntrada += factura.Monto;
        }
      });

      // Calcula el total general sumando los totales de cada tipo de pago
      const totalGeneral = totalSalida + totalEntrada;

      // Ahora puedes guardar los totales en el estado o hacer lo que necesites con ellos
      setMovimientoS(totalSalida);
      setMovimientoE(totalEntrada);
      setMovimiento(totalGeneral);
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
      const suma = allApartados.reduce((total, apartadoItem) => {
        return total + (apartadoItem.Saldo || 0);
      }, 0);
      setSuma(suma);
    } catch (error) {
      console.error("Error al obtener apartado: ", error);
    }
  };
  useEffect(() => { obtenerApartado() }, []);
  useEffect(() => { obtenerFactura() }, []);
  useEffect(() => { obtenerMovimiento() }, []);
  useEffect(() => { obtenerProducto()}, []);
  return (
    <div>
      <h4>Corte de fecha de hoy{ }</h4>
      <div id="pantalla">
        <div id="tabla">
          <label>
            Cantidad de dinero en apertura de caja:
            <input
              type="number"
              value={entrada}
              onChange={(e) => setEntrada(Number(e.target.value))}
            />
          </label>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th colSpan={2}>Movimientos de dinero </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Entrada de dinero</td>
                <td>₡{movimientoE}</td>
              </tr>
              <tr>
                <td>Salida de dinero</td>
                <td>₡{movimientoS}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>₡ {movimiento}</td>
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
                <td>Dinero inicial</td>
                <td>₡{entrada}</td>
              </tr>
              <tr>
                <td>Efectivo</td>
                <td>₡ {efectivo}</td>
              </tr>
              <tr>
                <td>Tarjeta de debito o credito</td>
                <td>₡{targeta}</td>
              </tr>
              <tr>
                <td>SINPE</td>
                <td>₡{simpe}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div id="columna2">
          <Table striped bordered hover size="sm">
          <h2>Productos más vendidos</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad Vendida</th>
          </tr>
        </thead>
        <tbody>
          {producto.map((producto, index) => (
            <tr key={index}>
              <td>{producto.Nombre}</td>
              <td>{producto.CantidaVendidos}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
        <h3>Ventas Totales: ₡ {total}</h3>
        <h3>Ganancia del día: ₡{total - movimientoS - entrada}</h3>
      </div>
    </div>
  );
}
export default ResponsiveBreakpointsExample;
