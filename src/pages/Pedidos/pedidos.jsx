//-------------------------------------------------Imports generales--------------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./pedidos.css";
import "bootstrap/dist/css/bootstrap.min.css";
//-------------------------------------------------Imports Modals------------------------------------------------------------------------
import ModalA from "../../components/modal-editar/modal-editar-departamentos";
import ModalEliminarPedido from "../../components/modal-eliminar/modal-eliminar-pedidos";
import ModalDetallesPedido from "../../components/datallesModal/modalDetallesPedido";
//-------------------------------------------------Imports Firebase----------------------------------------------------------------------
import { Table, Button, Container } from "reactstrap";
import appHOT from "../../firebase/firebaseHOT";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc, deleteDoc, addDoc, orderBy } from "firebase/firestore";
//-------------------------------------------------Imports Fontawesome---------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fromUnixTime } from "date-fns";
import { format } from "date-fns";
import TopNavBar from "../../components/navbarC/navbar";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft);
const nombre = "Pedido";

//------------------------------------------------Inicio de funcion----------------------------------------------------------------------------
function Pedidos() {

  const db = getFirestore(appHOT);

  //----------------------------------------------Hooks varios--------------------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pedidos, setDepartamento] = useState([]);
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] = useModal(false);
  const [isOpenDetalles, openModalDetalles, closeModalDetalles] = useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] = useModal(false);
  const [dataState, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  let encontrado = '';
  useEffect(() => {
    obtenerDepartamentos(1); // Fetch the first page of departments
  }, [selectedDate]);
  //----------------------------------------------Editar------------------------------------------------------------------------------------------------
  const fieldOrderEditar = {
    1: "codigoDescuento", // Primer campo en aparecer
    2: "Estado",
    6: "idUsuario",
  };
  const abrirModalActualizar = (id) => {
    setDepartamento(id);
    openModalActualizar();
  };
  const validateField = (fieldName, value) => {
    const errors = {}
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "estado":
        fieldErrors.contrasena =
          isNaN(Number(value)) ? "El estado deben ser numeros" : "";
        break;
      default:
        break;
    }

    return (fieldErrors);
  };

  const editar = async (form) => {


    const q = query(collection(db, "Pedido"), where("id", "==", pedidos.id));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      encontrado = doc.id;
    });

    const docrefence = doc(db, "Pedido", encontrado);
    console.log(docrefence);

    console.log(pedidos.id);
    console.log(encontrado);
    console.log('Formulario:', form);
    try {
      const department = doc(db, "Pedido", encontrado);
      console.log(pedidos)
      console.log('Formulario:', form);

      await updateDoc(department, {
        codigoDescuento: form.codigoDescuento,
        Estado: form.Estado,
        idUsuario: form.idUsuario,
      });
      console.log("Document successfully updated!");
      onCreateDepartamentos();

    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  //-----------------------------------------------------Ver-------------------------------------------------------
  const [searchOption, setSearchOption] = useState("id");
  const filteredUsers = dataState.filter((pedidos) => {
    const searchTerm = searchQuery;
    if (searchOption === "id") {
      return pedidos.id.includes(searchTerm);
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

      const cajaRef = collection(db, "Pedido");

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

  //---------------------------------------------------------Detalles Productos--------------------------------------------------------------------
  const abrirModalDetalles = (id) => {
    setDepartamento(id);
    openModalDetalles();
  };



  //-------------------------------------------------------------Crear------------------------------------------------------------------------
  /* const fieldOrderCrear = {
    1: "codigoDescuento", // Primer campo en aparecer
    2: "Estado",
    3: "Fecha",
    6: "idUsuario",
  };
  const validateFieldCrear = (fieldName, value) => {
    const errors = {}
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "estado":
        fieldErrors.contrasena =
          isNaN(Number(value)) ? "El estado deben ser numeros" : "";
        break;
      default:
        break;
    }

    return (fieldErrors);
  };
  const crearDepartamento = async (form) => {
    try {
      // Crear usuario en Firebase Authentication
      // Obtener el ID de usuario del usuario creado
      // Agregar información del usuario a Firestore

      console.log(db);
      console.log(form);
      await addDoc(collection(db, "Pedido"), {
        CodigoDescuento: form.CodigoDescuento,
        Estado: form.Estado,
        Fecha: form.Fecha,
        NumeroPedido: form.NumeroPedido,
        Productos: form.Productos,
        idUsuario: form.idUsuario
      });

      console.log("Departamento creado y documentado en Firestore");
      onCreateDepartamentos();
    } catch (error) {
      console.error("Error al crear departamento y documentar en Firestore: ", error);
    }
  };

  const initialFormState = {
    CodigoDescuento: "",
    Estado: 1,
    Fecha: "",
    NumeroPedido: 1,
    Productos: "",
    idUsuario: 1
  }; */

  //-------------------------------------------------------Eliminar---------------------------------------------------------------------

  const abrirModalEliminar = (id) => {
    setDepartamento(id);
    openModalEliminar();
  };
  const eliminarDepartamento = async () => {
    try {

      // Eliminar el usuario de Firebase y Firestore


      const q = query(collection(db, "Pedido"), where("id", "==", pedidos.id));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        encontrado = doc.id;
      });

      await deleteDoc(doc(db, "Pedido", encontrado));
      console.log(encontrado)
      console.log("Departamento eliminado correctamente");
      onCreateDepartamentos();
    } catch (error) {
      console.error("Error al eliminar departamento: ", error);
    }
  };

  //---------------------------------------------------------HTML-------------------------------------------------------------
  return (
    <Container>
      <TopNavBar />
      <h1>Pedidos
      </h1>
      <br />
      <br />
      <br />
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
            <th>CodigoDescuento</th>
            <th>Estado</th>
            <th>Productos</th>
            <th>Numero de Cliente</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((dato) => (
            <tr key={dato.id}>
              <td>{formatTimestamp(dato.Fecha)}</td>
              <td>{dato.codigoDescuento}</td>
              <td>{dato.Estado}</td>
              <td><Button
              onClick={() => abrirModalDetalles(dato)}
              color="primary">Detalles de Producto</Button></td>
              <td>{dato.idUsuario}</td>
              <td>
                <Button
                  onClick={() => abrirModalActualizar(dato)}
                  color="primary"
                >
                  <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                </Button>
                <Button
                  onClick={() => abrirModalEliminar(dato)}
                  color="danger"
                >
                  <FontAwesomeIcon icon={faSquareXmark} size="lg" />
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

      <ModalA
        isOpenA={isOpenActualizar}
        closeModal={closeModalActualizar}
        elemento={pedidos}
        validateField={validateField}
        FuntionEdit={editar}
        fieldOrder={fieldOrderEditar}
        nombreCrud={nombre}
      />
      <ModalEliminarPedido
        isOpen={isOpenEliminar}
        closeModal={closeModalEliminar}
        nombre={pedidos.id}
        funtionDelete={eliminarDepartamento}
        nombreCrud={nombre}
      />
      {isOpenDetalles && ( 
        <ModalDetallesPedido
          isOpenA={isOpenDetalles}
          closeModal={closeModalDetalles}
          elemento={pedidos}
          nombreCrud={nombre}
        />
      )}
    </Container>
  );
}

export default Pedidos;
