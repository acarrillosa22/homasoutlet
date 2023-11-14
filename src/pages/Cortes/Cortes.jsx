//-------------------------------------------------Imports generales--------------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./Cortes.css";
import "bootstrap/dist/css/bootstrap.min.css";
//-------------------------------------------------Imports Modals------------------------------------------------------------------------
import ModalA from "../../components/modal-editar/modal-editar-departamentos";
import ModalCrear from "../../components/modal-crear/modal-crear-departamentos";
import ModalEliminar from "../../components/modal-eliminar/modal-eliminar-departamento";
import CustomAlert from '../../components/alert/alert';
//-------------------------------------------------Imports Firebase----------------------------------------------------------------------
import { Table, Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc, deleteDoc, addDoc, orderBy } from "firebase/firestore";
//-------------------------------------------------Imports Fontawesome---------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretUp, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faCartFlatbed } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fromUnixTime } from "date-fns";
import { format } from "date-fns";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft,faCaretUp);
const nombre = "Producto";
//------------------------------------------------Inicio de funcion----------------------------------------------------------------------------
function Corte() {
  const db = getFirestore(appPVH);
  //----------------------------------------------Hooks varios--------------------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [producto, setProducto] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState("");
  const [tipoAlert, setTipoAlert] = useState("");
  const [departamento, setDepartamento] = useState([]);
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] = useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] = useModal(false);
  const [dataState, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  let encontrado = '';
  useEffect(() => {
    obtenerDepartamentos(1);
  }, [selectedDate]);


  //----------------------------------------------Editar------------------------------------------------------------------------------------------------


  //-----------------------------------------------------Ver-------------------------------------------------------
  const [searchOption, setSearchOption] = useState("Encargado");
  const filteredUsers = dataState.filter((departamento) => {
    const searchTerm = searchQuery;
    console.log(departamento);
    if (searchOption === "Encargado") {
      return departamento.Encargado.includes(searchTerm);
    }
    else
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
    console.log("Cortes:", selectedTimestamp);
  };

  filteredUsers.map((dato) => (
    <tr key={dato.Encargado}>
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
        
      const cajaRef = collection(db, "Corte");

      let queryRef = query(cajaRef, orderBy("Fecha", "desc"));
      

      if (selectedDate) {
        const selectedTimestamp = fromUnixTime(selectedDate);
        queryRef = query(queryRef, where("Fecha", ">=", selectedTimestamp));

      }
      const querySnapshot = await getDocs(queryRef);
      const allCajas = querySnapshot.docs.map((departamento) => departamento.data());
      const cajasPerPage = 10;
      const startIndex = (page - 1) * cajasPerPage;
      const slicedCajas = allCajas.slice(startIndex, startIndex + cajasPerPage);
      console.log("Facturas filtradas:", slicedCajas);
      setData(slicedCajas);
    } catch (error) {
      console.error("Error al obtener pedidos: ", error);
    }
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return format(date, "dd/MM/yyyy"); // Formatea la fecha como "dd/MM/yyyy"
  };

  const onCreateDepartamentos = () => {
    // Actualizar la lista de usuarios llamando a obtenerUsuarios nuevamente
    obtenerDepartamentos(1);
  };
  

  //-------------------------------------------------------------Crear------------------------------------------------------------------------
  
  //-------------------------------------------------------Eliminar---------------------------------------------------------------------
  
  //---------------------------------------------------------HTML-------------------------------------------------------------
  return (
    <Container>
      <h1>Cortes</h1>
      <br />
      <br />
      <br />
      <div className="date-picker">
        <label>Fechas anteriores a:</label>
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
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={`Buscar por Encargado`}
      />

      <Table>
        <thead>
          <tr>
            <th>Encargado</th>
            <th>Apertura</th>
            <th>Caja</th>
            <th>Cierre</th>
            <th>Fecha</th>
            <th>Fecha de Cierre</th>
            <th>Efectivo</th>
            <th>Tarjeta</th>
            <th>Sinpe</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((dato) => (
            <tr key={dato.Encargado}>
              <td>{dato.Encargado}</td>
              <td>{dato.Apertura}</td>
              <td>{dato.Caja}</td>
              <td>{dato.Cierre}</td>
              <td>{formatTimestamp(dato.Fecha)}</td>
              <td>{formatTimestamp(dato.FechaCierre)}</td>
              <td>{dato.MontoEfectivo}</td>
              <td>{dato.MontoTarjeta}</td>
              <td>{dato.MontoSinpe}</td>
              <td>{dato.Total}</td>
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

      {showAlert && (<CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />)}
    </Container>
  );
}
export default Corte;