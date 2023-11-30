import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "./tabla.css";
import { useModal } from "../../hooks/useModal";
import CustomAlert from '../../components/alert/alert';
import { Button, Container, Navbar } from "reactstrap";
import appPVH from "../../firebase/firebase";
import ModalMovimiento from "./modalMovimiento";
import HacerCorte from "./modalCorte";
import PrimerCorte from "./primerCorte";
import { getFirestore, collection, getDocs, query, updateDoc, setDoc, addDoc, orderBy, limit, where, doc } from "firebase/firestore";
//-------------------------------------------------Imports Fontawesome---------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretUp, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TopNavBar from "../navbarC/navbar";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft, faCaretUp);

function CortesInfo() {
  const db = getFirestore(appPVH);
  const [corte, setCorte] = useState([]);
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
  const [movimientoE, setMovimientoE] = useState([]);
  const [sumaD, setSuma] = useState([]);
  const [sumaC, setSumaC] = useState([]);
  const [isOpenDetalles, openModalDetalles, closeModalDetalles] = useModal(false);
  const [isOpenCorte, openModalCorte, closeModalCorte] = useModal(false);
  const [efectivo, setEfectivo] = useState([]);
  const [entrada, setEntrada] = useState(0);
  const [targeta, setTargeta] = useState([]);
  const [simpe, setSimpe] = useState([]);
  const [total, setTotal] = useState([]);
  useEffect(() => {
    // Obtener datos de la memoria local al cargar el componente
    const corteData = localStorage.getItem('corteId');
    const cajaUsoData = localStorage.getItem('cajaUso');
    const perfilGuardado = localStorage.getItem("usuarioC");
    const aperturaC = localStorage.getItem('apertura');
    if (perfilGuardado) {
      const perfil = JSON.parse(perfilGuardado);
      setUsuarioC(perfil);
    }
    // Actualizar estados con los datos obtenidos de la memoria local
    setEntrada(aperturaC ? parseFloat(aperturaC) : 0); // Parsea el valor como número
    setCajaU(cajaUsoData || ""); // Si es nulo o indefinido, asigna una cadena vacía
    setCorte(corteData || "");
  }, [isOpenCorte]);

  const obtenerDepartamentos = async () => {
    try {
      const userRef = collection(db, "Departamento");
      const userSnapshot = await getDocs(userRef);
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
      setDepartamento(departamentosConVentas);
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
        if (factura.TipoPago === "Sinpe" && factura.Corte === corte) {
          totalSimpe += factura.Total;
        } else if (factura.TipoPago === "Tarjeta" && factura.Corte === corte) {
          totalTargeta += factura.Total;
        } else if (factura.TipoPago === "Efectivo" && factura.Corte === corte) {
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
      let suma = 0;
      allD.forEach(ele => {
        let diferencia = 0;
        const fechaCorte = ele.Fecha.toDate();
        const diaCorte = fechaCorte.getDate();
        const mesCorte = fechaCorte.getMonth() + 1;
        const anioCorte = fechaCorte.getFullYear();
        if (dia === diaCorte && mes === mesCorte && anio === anioCorte) {
          ele.Productos.forEach(pro => {
            diferencia +=(pro.costo*pro.Cantidad);
          });
          suma+=(ele.Total-diferencia)
        }
      });
      setSumaC(suma);
    } catch (error) {
      console.error("Error al obtener facturas: ", error);
    }
  };
  const obtenerProducto = async () => {
    try {
      const userRef = collection(db, "Producto");
      // Crear una consulta que ordena los productos por la cantidad vendida en orden descendente y limita a 5 resultados
      const q = query(userRef, orderBy("CantidaVendidos", "desc"), limit(5));
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
        if (factura.Tipo === "Salida" && factura.Corte === corte) {
          totalSalida += factura.Monto;
        } else if (factura.Tipo === "Entrada" && factura.Corte === corte) {
          totalEntrada += factura.Monto;
        }
      });
      const totalGeneral = totalEntrada - totalSalida;
      setMovimientoS(totalSalida);
      setMovimientoE(totalEntrada);
      setMovimiento(totalGeneral);
    } catch (error) {
      console.error("Error al obtener Producto: ", error);
    }
  };
  let encontrado=null;
  const hacerCorte = async () => {
    const q = query(collection(db, "Corte"), where("Codigo", "==", corte));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      encontrado = doc.id;
    });
    try {
      const cierre = efectivo + movimiento + entrada;
      const department = doc(db, "Corte", encontrado);
      await updateDoc(department, {
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

  const handleActualizarDatos = () => {
    // Llama a las funciones de obtención de datos al hacer clic en el botón
    obtenerApartado();
    obtenerFactura();
    obtenerMovimiento();
    obtenerDepartamentos();
  };

  useEffect(() => {
    obtenerApartado();
    obtenerFactura();
    obtenerMovimiento();
    obtenerProducto();
    obtenerDepartamentos();
  }, []);

  useEffect(() => {
    obtenerApartado();
    obtenerFactura();
    obtenerMovimiento();
    obtenerDepartamentos();
  }, [isOpenCorte, isOpenDetalles]);
  return (
    <Container>
      <TopNavBar />
      <h4 id="enc">Corte de fecha de hoy: {fechaActual.toDateString()}</h4>
      <div className="bottones">
        <Button
          onClick={openModalCorte} color="success">
          Hacer Corte
        </Button>

        <Button onClick={openModalDetalles} color="success">
          Hacer Movimiento
        </Button>

        <Button onClick={handleActualizarDatos} color="primary">
          Actualizar Datos
        </Button>
      </div>
      <div id="pantalla">
        <div id="tabla">
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th colSpan={2}>Movimientos de dinero en caja</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dinero inicial</td>
                <td>₡{entrada}</td>
              </tr>
              <tr>
                <td>Entrada de dinero</td>
                <td>₡{movimientoE}</td>
              </tr>
              <tr>
                <td>Salida de dinero</td>
                <td>₡{movimientoS}</td>
              </tr>
              <tr>
                <td>Pagos en Efectivo</td>
                <td>₡{efectivo}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>₡{movimiento + efectivo + entrada}</td>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th colSpan={2}>Ventas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Efectivo</td>
                <td>₡{efectivo}</td>
              </tr>
              <tr>
                <td>Tarjeta de débito o crédito</td>
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
            <thead>
              <tr>
                <th colSpan={2}>Ventas por Departamento en el Corte</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapea los primeros tres departamentos con más ventas */}
              {departamento.slice(0, 3).map((dep, index) => (
                <tr key={index}>
                  <td>{dep.nombre}</td>
                  <td>₡{dep.montoVentas}</td>
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
        <h3>Ventas Totales: ₡{total}</h3>
        <h3>Ganancia del día: ₡{sumaC}</h3>
      </div>
      <ModalMovimiento
        isOpenA={isOpenDetalles}
        closeModal={closeModalDetalles}
        corte={corte}
      />
      <HacerCorte
        isOpenA={isOpenCorte}
        closeModal={closeModalCorte}
        usuarioC={usuarioC.nombre}
        cajaUso={cajaUso}
        hacer={hacerCorte}
      />
      {showAlert && (<CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />)}
    </Container>
  );
}
export default CortesInfo;
