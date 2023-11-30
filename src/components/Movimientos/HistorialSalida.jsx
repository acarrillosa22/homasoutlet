//-------------------------------------------------Imports generales--------------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import "./HistorialSalida.css";
import "bootstrap/dist/css/bootstrap.min.css";
//-------------------------------------------------Imports Firebase----------------------------------------------------------------------
import { Table, Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
//-------------------------------------------------Imports Fontawesome---------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fromUnixTime } from "date-fns";
import { format } from "date-fns";
import TopNavBar from "../navbarC/navbar";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft);
//------------------------------------------------Inicio de funcion----------------------------------------------------------------------------
function HistorialSalida() {

  const db = getFirestore(appPVH);
  //----------------------------------------------Hooks varios--------------------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dataState, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    obtenerDepartamentos(1); // Fetch the first page of departments
  }, [selectedDate]);
  const [searchOption, setSearchOption] = useState("Tipo");
  const filteredUsers = dataState.filter((pedidos) => {
    console.log(pedidos);
    const searchTerm = searchQuery;
    if (searchOption === "Tipo") {
      return pedidos.Tipo.includes(searchTerm);
    } else
      return false;
  });



  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDateChange = (e) => {
    const selectedTimestamp = (e.target.valueAsNumber / 1000); // Divide por 1000 para convertir de milisegundos a segundos
    setSelectedDate(selectedTimestamp);
    console.log("Pedidos:", selectedTimestamp);
  };

  filteredUsers.map((dato) => (
    <tr key={dato.id}>
    </tr>
  ));
  const handleNextPage = () => {
    // Increment the page and fetch the next page of users
    obtenerDepartamentos(currentPage + 1);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // Decrement the page and fetch the previous page of users
      obtenerDepartamentos(currentPage - 1);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const obtenerDepartamentos = async (page) => {
    try {

      const cajaRef = collection(db, "Movimiento");


      let queryRef = query(cajaRef, orderBy("Fecha", "desc"));

      
      if (selectedDate) {
        const selectedTimestamp = fromUnixTime(selectedDate);
        queryRef = query(queryRef, where("Fecha", ">=", selectedTimestamp));

      }
      const querySnapshot = await getDocs(queryRef);
      const allCajas = querySnapshot.docs.map((pedidos) => pedidos.data());
      const cajasPerPage = 10;
      const startIndex = (page - 1) * cajasPerPage;
      const slicedCajas = allCajas.slice(startIndex, startIndex + cajasPerPage);
      setData(slicedCajas);
    } catch (error) {
      console.error("Error al obtener pedidos: ", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return format(date, "dd/MM/yyyy"); // Formatea la fecha como "dd/MM/yyyy"
  };
  //---------------------------------------------------------HTML-------------------------------------------------------------
  return (
    <Container>
      <TopNavBar />
      <h1>Movimientos
      </h1>
      <br />
      <br />
      <br />
      <label>Fechas superiores a:</label>
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
            <th>Fecha</th>
            <th>Motivo</th>
            <th>Tipo</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((dato) => (
            <tr key={dato.id}>
              <td>{formatTimestamp(dato.Fecha)}</td>
              <td>{dato.Motivo}</td>
              <td>{dato.Tipo}</td>
              <td>{dato.Monto}</td>
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
    </Container>
  );
}

export default HistorialSalida;