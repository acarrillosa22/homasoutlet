import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./HistorialFactura.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import "react-datepicker/dist/react-datepicker.css";

import ModalDetallesFactura from "../../components/datallesModal/modalDetallesFactura.jsx";
// Firebase
import { Table, Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import jsPDF from 'jspdf';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight, faArrowLeft,faPrint } from "@fortawesome/free-solid-svg-icons";
import { fromUnixTime } from "date-fns";
import { format } from "date-fns";
import { fromMillis } from "firebase/firestore";
import TopNavBar from "../../components/navbarC/navbar.jsx";
library.add(faArrowRight, faArrowLeft, faEye,faPrint);

function HistorialFactura() {
  const db = getFirestore(appPVH);
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return format(date, "dd/MM/yyyy"); // Formatea la fecha como "dd/MM/yyyy"
  };
  const generarPDF = (dato) => {
    const doc = new jsPDF();
    var numArticulos = 0;
  
    // Configuración de fuente y tamaño para el encabezado
    doc.setFontSize(10);
    doc.text(`${dato.Encabezado.Dueño.Nombre}`, 95, 10);
    doc.text(`${dato.Encabezado.Dueño.Cedula}`, 70, 10);
    doc.text('FACEBOOK: HOMAS OUTLET', 75, 20);
    doc.text(`CORREO:${dato.Encabezado.CorreoSede}`, 67, 30);
    doc.text(`TELÉFONO: ${dato.Encabezado.Telefono}`, 78, 40);
    doc.text(`${formatTimestamp(dato.Fecha)}`, 90, 50);
    doc.text(`Cajero: ${dato.Cajero}`, 10, 60);
    doc.setFontSize(12);
    
    // Contenido de la factura
    doc.text(`CANTIDAD`, 10, 70);
    doc.text(`DESCRIPCIÓN `, 70, 70);
    doc.text(`IMPORTE `, 145, 70);
    doc.text(`========================================================================================================`, 1, 80);
  
    let yOffset = 90; // Posición vertical inicial para los productos
  
    for (let index = 0; index < dato.Productos.length; index++) {
      doc.text(`${dato.Productos[index].Cantidad}`, 15, yOffset);
      doc.text(`${dato.Productos[index].Nombre}`, 60, yOffset);
      doc.text(`${dato.Productos[index].importe}`, 150, yOffset);
      numArticulos += dato.Productos[index].Cantidad;
      yOffset += 10; // Ajuste vertical para el siguiente producto
    }
    doc.text(`========================================================================================================`, 1, yOffset);
    doc.text(`No.Artículos: ${numArticulos || ''}`, 40, yOffset + 10);
    doc.setFontSize(10);
    doc.text(`TOTAL: ${dato.Total}`, 125, yOffset + 10);
    doc.text(`SE HA RECIBIDO: ${dato.pagoCliente}`, 5, yOffset + 20);
    doc.text(`SE HA DEVUELTO: ${dato.vuelvoCliente}`, 90, yOffset + 20);
    doc.text(`USTED HA AHORRADO: ${dato.Descuento}`, 145, yOffset + 20);
    doc.text(`¡¡GRACIAS POR SU COMPRA!!`, 80, yOffset + 40);
    doc.text('LOS ARTÍCULOS ELÉCTRICOS TIENEN UN MES DE GARANTÍA.', 60, yOffset + 50);
    doc.text('EL CAJERO DEBE COMPROBAR EL ESTADO DE LOS ARTÍCULOS ANTES DE SALIR DE LA TIENDA.', 25, yOffset + 60);
  
    // Descargar el PDF
    doc.save('Homas_Factura.pdf');
  };
  // Hooks
  const [currentPage, setCurrentPage] = useState(1);
  const [usuario, setUsuario] = useState([]);
  const [isOpenDetalles, openModalDetalles, closeModalDetalles] =
    useModal(false);
  const [dataState, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    obtenerUsuarios(1); // Fetch the first page of users
  }, [selectedDate]); // Agrega selectedDate como dependencia

  const handleNextPage = () => {
    // Increment the page and fetch the next page of users
    obtenerUsuarios(currentPage + 1);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // Decrement the page and fetch the previous page of users
      obtenerUsuarios(currentPage - 1);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleDateChange = (e) => {
    const selectedTimestamp = (e.target.valueAsNumber / 1000); // Divide por 1000 para convertir de milisegundos a segundos
    setSelectedDate(selectedTimestamp);
  };

  const obtenerUsuarios = async (page) => {
    try {
      setCurrentPage(page);
      const cajaRef = collection(db, "Factura");
      let queryRef = query(cajaRef, orderBy("Fecha", "desc")); // Ordenar por fecha descendente

      if (selectedDate) {
        const selectedTimestamp = fromUnixTime(selectedDate);
        queryRef = query(queryRef, where("Fecha", ">=", selectedTimestamp));

      }

      const querySnapshot = await getDocs(queryRef);
      const allCajas = querySnapshot.docs.map((caja) => caja.data());
      const cajasPerPage = 10;
      const startIndex = (page - 1) * cajasPerPage;
      const slicedCajas = allCajas.slice(startIndex, startIndex + cajasPerPage);
      setData(slicedCajas);
    } catch (error) {
      console.error("Error al obtener Facturas: ", error);
    }
  };

  const abrirModalDetalles = (cedula) => {
    setUsuario(cedula);
    openModalDetalles();
  };


  return (
    <Container>
      <TopNavBar />
      <h1>Historial de facturas</h1>
      <div className="date-picker">
        <input
          type="date"
          value={
            selectedDate
              ? new Date(selectedDate * 1000).toISOString().substr(0, 10)
              : ""
          }
          onChange={handleDateChange}
        />
        <Button onClick={() => setSelectedDate(null)}>Limpiar Fecha</Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Cajero</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dataState.map((dato) => (
            <tr key={dato.Fecha.seconds}>
              <td>{dato.Cajero}</td>
              <td>{formatTimestamp(dato.Fecha)}</td>
              <td>{dato.Total}</td>
              <td>{dato.Cliente}</td>
              <td>
                <Button
                  onClick={() => abrirModalDetalles(dato)}
                  color="warning"
                  className="bbb"
                >
                  <FontAwesomeIcon icon={faEye} size="lg" />
                </Button>
                <Button
                  onClick={() => generarPDF(dato)}
                  color="info"
                  className="bbb"
                >
                  <FontAwesomeIcon icon={faPrint} size="lg" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          color="primary"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </Button>
        <span> Pagina: {currentPage}</span>
        <Button
          onClick={handleNextPage}
          disabled={dataState.length < 10}
          color="primary"
        >
          <FontAwesomeIcon icon={faArrowRight} size="lg" />
        </Button>
      </div>
      {isOpenDetalles && (
        <ModalDetallesFactura
          isOpenA={isOpenDetalles}
          closeModal={closeModalDetalles}
          elemento={usuario}
          mostrar={true}
        />
      )}
    </Container>
  );
}

export default HistorialFactura;
