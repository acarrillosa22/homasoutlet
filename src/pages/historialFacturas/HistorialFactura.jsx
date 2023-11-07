import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./HistorialFactura.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalDetallesFactura from "../../components/datallesModal/modalDetallesFactura.jsx";
// Firebase
import { Timestamp } from "firebase/firestore";
import { Table, Button, Container } from "reactstrap";
import appFirebase from "../../firebase/firebase.config";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fromUnixTime } from "date-fns";
import { format } from "date-fns";
import { fromMillis } from "firebase/firestore";
library.add(faArrowRight, faArrowLeft, faEye);

function HistorialFactura() {
  const nombre = "Detalles de factura";
  const db = getFirestore(appFirebase);

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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return format(date, "dd/MM/yyyy"); // Formatea la fecha como "dd/MM/yyyy"
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
