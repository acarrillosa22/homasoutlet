import React, { useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import "./tabla.css";
<<<<<<< HEAD
import { useModal } from "../../hooks/useModal";
import CustomAlert from '../../components/alert/alert';
import { Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import ModalMovimiento from "./modalMovimiento";
import HacerCorte from "./modalCorte";
import { getFirestore, collection, getDocs, query, updateDoc, setDoc, addDoc, orderBy, limit, where } from "firebase/firestore";
//-------------------------------------------------Imports Fontawesome---------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretUp, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft, faCaretUp);
=======
import { Button, Container, Modal } from "reactstrap";
import appPVH from "../../firebase/firebase";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc, addDoc, orderBy, limit, } from "firebase/firestore";
>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
function ResponsiveBreakpointsExample() {
  const db = getFirestore(appPVH);
  const [corte, setCorte] = useState([]);
  const [apertura, setApertura] = useState([]);
  const [cajaUso, setCajaU] = useState([]);
  const [usuarioC, setUsuarioC] = useState([]);
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1; // Suma 1 porque los meses son indexados desde 0
  const anio = fechaActual.getFullYear();
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState("");
  const [tipoAlert, setTipoAlert] = useState("");
  const [departamento, setDepartamento] = useState([]);
  const [producto, setProducto] = useState([]);
  const [movimiento, setMovimiento] = useState([]);
  const [movimientoS, setMovimientoS] = useState([]);
<<<<<<< HEAD
  const [movimientoE, setMovimientoE] = useState([]);
  const [sumaD, setSuma] = useState([]);
  const [sumaC, setSumaC] = useState([]);
  const [isOpenDetalles, openModalDetalles, closeModalDetalles] = useModal(false);
  const [isOpenCorte, openModalCorte, closeModalCorte] = useModal(false);
=======
  const [caja, setCaja] = useState([]);
  const [movimientoE, setMovimientoE] = useState([]);
  const [sumaD, setSuma] = useState([]);
>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
  const [efectivo, setEfectivo] = useState([]);
  const [entrada, setEntrada] = useState(0);
  const [targeta, setTargeta] = useState([]);
  const [simpe, setSimpe] = useState([]);
  const [total, setTotal] = useState([]);
<<<<<<< HEAD
  useEffect(() => {
    // Obtener datos de la memoria local al cargar el componente
    const corteData = localStorage.getItem('corte');
    const aperturaData = localStorage.getItem('apertura');
    const cajaUsoData = localStorage.getItem('cajaUso');
    const perfilGuardado = localStorage.getItem("usuarioC");

    if (perfilGuardado) {
        const perfil = JSON.parse(perfilGuardado);
        setUsuarioC(perfil);
    }
    // Actualizar estados con los datos obtenidos de la memoria local
    setCorte(corteData ? JSON.parse(corteData) : []);
    setEntrada(aperturaData ? JSON.parse(aperturaData) : []);
    setCajaU(cajaUsoData ? JSON.parse(cajaUsoData) : []);
  }, []);
=======

>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
  const obtenerDepartamentos = async () => {
    try {
      const userRef = collection(db, "Departamento");
      const userSnapshot = await getDocs(userRef);
<<<<<<< HEAD
      const allD = userSnapshot.docs.map((departament) => departament.data());
      const departamentosConMontos = allD.map((departamento) => {
        const ventasFiltradas = departamento.Ventas.filter((venta) => venta.Corte === corte);
        const montoVentas = ventasFiltradas.reduce((total, venta) => total + venta.Monto, 0);
        return {
          nombre: departamento.Nombre, // Reemplaza "Nombre" con el nombre real del campo que almacena el nombre del departamento
          montoVentas: montoVentas,
        };
      });
      // Filtrar departamentos que no tienen ventas en el corte
      const departamentosConVentas = departamentosConMontos
        .filter((departamento) => departamento.montoVentas > 0);
      // Ordenar por monto de ventas en orden descendente
      departamentosConVentas.sort((a, b) => b.montoVentas - a.montoVentas);
      // Ahora tienes la lista ordenada y filtrada por el monto de ventas en "departamentosConVentas"
      console.log(departamentosConVentas);

      // Puedes asignar la lista ordenada a tu estado o realizar cualquier otra acción necesaria
      setDepartamento(departamentosConVentas);
=======
      const allD = userSnapshot.docs
        .map((departament) => departament.data())
      setDepartamento(allD);
>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
    } catch (error) {
      console.error("Error al obtener departamentos: ", error);
    }
  };
  const obtenerFactura = async () => {
    try {
      const userRef = collection(db, "Factura");
      const userSnapshot = await getDocs(userRef);
      const allD = userSnapshot.docs.map((factura) => factura.data());
<<<<<<< HEAD
      let totalSimpe = 0;
      let totalTargeta = 0;
      let totalEfectivo = 0;
      allD.forEach((factura) => {
        if (factura.TipoPago === "Simpe" && factura.Corte === corte) {
          totalSimpe += factura.Total;
        } else if (factura.TipoPago === "Targeta" && factura.Corte === corte) {
          totalTargeta += factura.Total;
        } else if (factura.TipoPago === "Efectivo" && factura.Corte === corte) {
=======

      let totalSimpe = 0;
      let totalTargeta = 0;
      let totalEfectivo = 0;

      allD.forEach((factura) => {
        if (factura.TipoPago === "Simpe") {
          totalSimpe += factura.Total;
        } else if (factura.TipoPago === "Targeta") {
          totalTargeta += factura.Total;
        } else if (factura.TipoPago === "Efectivo") {
>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
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
<<<<<<< HEAD
      // Crear una consulta que ordena los productos por la cantidad vendida en orden descendente y limita a 3 resultados
      const q = query(userRef, orderBy("CantidaVendidos", "desc"), limit(3));
      const userSnapshot = await getDocs(q);
      const all = userSnapshot.docs.map((producto) => producto.data());
=======

      // Crear una consulta que ordena los productos por la cantidad vendida en orden descendente y limita a 3 resultados
      const q = query(userRef, orderBy("CantidaVendidos", "desc"), limit(3));

      const userSnapshot = await getDocs(q);

      const all = userSnapshot.docs.map((producto) => producto.data());

>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
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
<<<<<<< HEAD
      all.forEach((factura) => {
        if (factura.Tipo === "Salida" && factura.Corte === corte) {
          totalSalida += factura.Monto;
        } else if (factura.Tipo === "Entrada" && factura.Corte === corte) {
          totalEntrada += factura.Monto;
        }
      });
      const totalGeneral = totalEntrada - totalSalida;
=======

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
>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
      setMovimientoS(totalSalida);
      setMovimientoE(totalEntrada);
      setMovimiento(totalGeneral);
    } catch (error) {
      console.error("Error al obtener Producto: ", error);
    }
  };
<<<<<<< HEAD
  const hacerCorte = async () => {
    try {
      const cierre = total + movimiento + apertura;
      await updateDoc(corte, {
        Cierre: cierre,
        FechaCierre: new Date(),
        MontoEfectivo: parseFloat(efectivo),
        MontoSinpe: parseFloat(simpe),
        MontoTarjeta: parseFloat(targeta),
        Total: parseFloat(total)
      });
      setTextoAlert("Corte realizado con éxito");
      setTipoAlert("success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
    } catch (error) {
      console.error("Error al crear corte y documentar en Firestore: ", error);
=======
  useEffect(() => { obtenerCajas(); }, []);
  const obtenerCajas = async () => {
    try {
      const userRef = collection(db, "Cajas");
      const userSnapshot = await getDocs(userRef);
      const allDepartmentos = userSnapshot.docs
        .map((departament) => departament.data())
        setCaja(allDepartmentos);
    } catch (error) {
      console.error("Error al obtener departamentos: ", error);
>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
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
<<<<<<< HEAD
  const obtenerCorte = async () => {
    try {
      const userRef = collection(db, "Corte");
      const userSnapshot = await getDocs(userRef);
      // Obtener la fecha actual
      const allCortes = userSnapshot.docs.map((product) => product.data());
      let suma = 0;
      allCortes.forEach(ele => {
        const fechaCorte = ele.Fecha.toDate();
        const diaCorte = fechaCorte.getDate();
        const mesCorte = fechaCorte.getMonth() + 1;
        const anioCorte = fechaCorte.getFullYear();
        if (dia === diaCorte && mes === mesCorte && anio === anioCorte) {
          suma += ele.Total;
        }
      });
      setSumaC(suma);
    } catch (error) {
      console.error("Error al obtener Cortes: ", error);
    }
  };
  useEffect(() => {
    obtenerApartado();
    obtenerCorte();
    obtenerFactura();
    obtenerMovimiento();
    obtenerProducto();
    obtenerDepartamentos();
  }, []);
  return (
    <Container>
      <h4>Corte de fecha de hoy: {fechaActual.toDateString()}</h4>
      <div id="pantalla">
        <div id="tabla">
          <Button
           onClick={openModalCorte} color="success">
              Hacer Corte
          </Button>
          <Button onClick={openModalDetalles} color="success">
            Hacer Movimiento
          </Button>
=======
  useEffect(() => { obtenerApartado() }, []);
  useEffect(() => { obtenerFactura() }, []);
  useEffect(() => { obtenerMovimiento() }, []);
  useEffect(() => { obtenerProducto() }, []);
  return (
    <div>
      <h4>Corte de fecha de hoy{ }</h4>
      <div id="pantalla">
        <div id="tabla">
          <Modal>
            <label>
              Cantidad de dinero en apertura de caja:
              <input
                type="number"
                min="1"
                value={entrada}
                onChange={(e) => setEntrada(Number(e.target.value))}
              />
            </label>
          </Modal>
>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
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
<<<<<<< HEAD
                <td>₡{efectivo}</td>
=======
                <td>₡ {efectivo}</td>
>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
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
<<<<<<< HEAD
=======
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
>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
            <thead>
              <tr>
                <th colSpan={2}>Ventas por Departamento</th>
              </tr>
            </thead>
            <tbody>
<<<<<<< HEAD
              {/* Mapea los primeros tres departamentos con más ventas */}
              {departamento.slice(0, 3).map((dep, index) => (
                <tr key={index}>
                  <td>{dep.nombre}</td>
                  <td>₡ {dep.montoVentas}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th colSpan={2}>Productos más vendidos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Nombre</th>
                <th>Cantidad Vendida</th>
              </tr>
              {producto.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.Nombre}</td>
                  <td>{producto.CantidaVendidos}</td>
                </tr>
              ))}
            </tbody>
          </Table>

        </div>
      </div>
      <div id="resumen">
        <h3>Deuda total de los clientes: ₡{sumaD}</h3>
        <h3>Ventas Totales: ₡ {total}</h3>
        <h3>Ganancia del día: ₡{total + sumaC}</h3>
      </div>
      <ModalMovimiento
        isOpenA={isOpenDetalles}
        closeModal={closeModalDetalles}
        corte={corte}
      />
      <HacerCorte
        isOpenA={isOpenCorte}
        closeModal={closeModalCorte}
        apertura={entrada}
        usuarioC={usuarioC.nombre}
        cajaUso={cajaUso}
        hacer={hacerCorte()}
      />
      {showAlert && (<CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />)}
    </Container>
=======
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
        <h3>Ganancia del día: ₡{total}</h3>
      </div>
    </div>
>>>>>>> c88a5f4f8daa49a9b5edb301b9a4f19517251ca6
  );
}
export default ResponsiveBreakpointsExample;
