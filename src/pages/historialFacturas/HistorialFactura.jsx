import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./HistorialFactura.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

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
library.add(faArrowRight, faArrowLeft, faEye,faPrint);

function HistorialFactura() {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return format(date, "dd/MM/yyyy"); // Formatea la fecha como "dd/MM/yyyy"
  };

  const nombre = "Detalles de factura";
  const db = getFirestore(appPVH);
  const generarPDF = (dato) => {
    const doc = new jsPDF();
    var numArticulos = 0;
    // Configuración de fuente y tamaño para el encabezado
    //doc.setFontSize(25);
   // doc.text(`${dato.Cajero.Nombre}`, 75, 20);
    doc.setFontSize(15);
    doc.text(`${dato.Encabezado.Dueño.Nombre}`, 100, 30);
    doc.text(`${dato.Encabezado.Dueño.Cedula}`, 65, 30);
    doc.text('FACEBOOK: HOMAS OUTLET', 75, 40);
    doc.text(`CORREO:${dato.Encabezado.CorreoSede}`, 60, 60);
    doc.text(`TELÉFONO: ${dato.Encabezado.Telefono}`, 85, 50);
    doc.text(`${formatTimestamp(dato.Fecha)}`, 85, 70);
    doc.setFontSize(20);

    // Contenido de la factura
    doc.text(`CAJERO: ${dato.Cajero.Nombre}`, 10, 90);
    doc.text(`CANTIDAD`, 10, 120);
    doc.text(`DESCRIPCIÓN `, 70, 120);
    doc.text(`IMPORTE `, 140, 120);
    doc.text(`=====================================================`, 1, 130);
    for (let index = 0; index < dato.Productos.length; index++) {
      doc.text(`${dato.Productos[index].Cantidad}`, 10, 140);
      doc.text(`${dato.Productos[index].Nombre}`, 50, 140);
      doc.text(`${dato.Productos[index].Precio}`, 150, 140);
      numArticulos =numArticulos+ dato.Productos[index].Cantidad;
    }
    doc.text(`=====================================================`, 1, 150);
    doc.text(`NO.ARTICULOS: ${numArticulos || ''}`, 70, 170);
    doc.setFontSize(25);
    doc.text(`TOTAL: ${dato.Total}`, 70, 190);
    doc.text(`SE HA RECIBIDO: ${dato.pagoCliente}`, 40, 210);
    doc.text(`SE HA DEVUELTO: ${dato.vuelvoCliente}`, 40, 230);
    doc.text(`USTED HA AHORRADO: ${dato.Descuento}`, 35, 250);
    doc.setFontSize(15);
    doc.text(`¡¡GRACIAS POR SU COMPRA!!`, 70, 270);
    doc.text('LOS ARTÍCULOS ELÉCTRICOS TIENEN UN MES DE GARANTÍA.', 40, 280);
    doc.text('EL CAJERO DEBE COMPROBAR EL ESTADO DE LOS ARTÍCULOS ANTES DE SALIR DE LA TIENDA.', 0, 290);

    // Descargar el PDF
    doc.save('mi_pdf.pdf');
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
    console.log("Facturas:", selectedTimestamp);
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
      console.log("Facturas filtradas:", slicedCajas);
      setData(slicedCajas);
    } catch (error) {
      console.error("Error al obtener Facturas: ", error);
    }
  };

  const abrirModalDetalles = (cedula) => {
    console.log(cedula);
    setUsuario(cedula);
    openModalDetalles();
  };


  return (
    <Container>
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dataState.map((dato) => (
            <tr key={dato.Fecha.seconds}>
              <td>{dato.Cajero.Nombre}</td>
              <td>{formatTimestamp(dato.Fecha)}</td>

              <td>{dato.Total}</td>

              <td>
                <Button
                  onClick={() => abrirModalDetalles(dato)}
                  color="warning"
                >
                  <FontAwesomeIcon icon={faEye} size="lg" />
                </Button>
                <Button
                  onClick={() => generarPDF(dato)}
                  color="info"
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
