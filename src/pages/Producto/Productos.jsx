import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./estilos.css"
import "bootstrap/dist/css/bootstrap.min.css";
//-------------------------------------------------Imports Modals------------------------------------------------------------------------
import ModalCrearP from "../../components/Crear producto/ModaloCrearP";
import ModalEP from "../../components/EditarProducto/ModalEditarP";
import ModalEliminarP from "../../components/Eliminar/ModalEliminar";
//-------------------------------------------------Imports Firebase----------------------------------------------------------------------
import { Table, Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc, addDoc } from "firebase/firestore";
//-------------------------------------------------Imports Fontawesome---------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import de from "date-fns/esm/locale/de/index.js";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft);
const nombre = "Departamento";
library.add(faPenToSquare, faSquareXmark);

function Producto() {
  const db = getFirestore(appPVH);

  //----------------------------------------------Hooks varios--------------------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [producto, setProducto] = useState([]);
  const [departa, setDeparta] = useState([]);
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] = useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] = useModal(false);
  const [dataState, setData] = useState([]);
  let encontrado = '';
  useEffect(() => {
    obtenerProductos(1); // Fetch the first page of products
  }, []);
  //-------------------------------------------Datos------------------------------
  const obtenerDepartamentos = async (page) => {
    try {
      console.log(departa);
      const usersPerPage = 10; // Number of users to fetch per page
      const startIndex = (page - 1) * usersPerPage;

      const userRef = collection(db, "Departamento");
      const userSnapshot = await getDocs(userRef);
      const allDepartmentos = userSnapshot.docs
        .map((departament) => departament.data())

      // Calculate the slice of users for the current page
      const slicedDeparmetns = allDepartmentos.slice(startIndex, startIndex + usersPerPage);

      setData(slicedDeparmetns); // Update the data state with the fetched users
    } catch (error) {
      console.error("Error al obtener Productos: ", error);
    }
  };
  //----------------------------------------------Editar------------------------------------------------------------------------------------------------
  const fieldOrderEditar = {
    1: "Nombre", // Primer campo en aparecer
    2: "Estado",
    3: "Descripcion",
    4: "Precio", 
    5: "Foto",
    6: "Descripcion",
  };

  const abrirModalActualizar = (id) => {
    console.log(producto);
    setProducto(id);
    console.log(id);
    openModalActualizar();
  };
  const abrirModalEliminar = (id) => {
    setProducto(id);
    console.log(id);
    openModalEliminar();
  };
  const handleNextPage = () => {
    // Increment the page and fetch the next page of users
    obtenerProductos(currentPage + 1);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // Decrement the page and fetch the previous page of users
      obtenerProductos(currentPage - 1);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const obtenerProductos = async (page) => {
    try {
      const departmentsPerPage = 10; // Number of users to fetch per page
      const startIndex = (page - 1) * departmentsPerPage;

      const departmentRef = collection(db, "Producto");
      const departmentsSnapshot = await getDocs(departmentRef);
      const allProducs = departmentsSnapshot.docs
        .map((user) => user.data());

      // Calculate the slice of users for the current page
      const slicedProducs = allProducs.slice(startIndex, startIndex + departmentsPerPage);

      setData(slicedProducs); // Update the data state with the fetched users
    } catch (error) {
      console.error("Error al obtener Productos: ", error);
    }
  };
  const onCreateProducto = () => {
    obtenerProductos(1);
  };

  return (
    <Container>
      <h1>Producto</h1>
      <br />
      <Button onClick={openModalCrear} color="success">
        Crear
      </Button>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar por nombre"
      />
      <br />
      <br />
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th>Descripción</th>
          </tr>
        </thead>

        <tbody>
          {dataState.map((dato) => (
            <tr key={dato.Id}>
              <td>{dato.Nombre}</td>
              <td>{dato.Estado}</td>
              <td>{dato.Cantidad}</td>
              <td>{dato.Precio}</td>
              <td>{dato.Imagen}</td>
              <td>{dato.Descripcion}</td>
              <td>
                <Button onClick={() => abrirModalActualizar(dato.Id)} color="primary">
                  <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                </Button>
                <Button onClick={() => abrirModalEliminar(dato.Id)} color="danger">
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

      <ModalEP isOpenED={isOpenActualizar} closeModal={closeModalActualizar} IDProducto={producto} onCreateProducto={onCreateProducto} />
      <ModalCrearP isOpenA={isOpenCrear} closeModal={closeModalCrear} onCreateDepartamento={onCreateProducto} />
      <ModalEliminarP isOpenD={isOpenEliminar} closeModal={closeModalEliminar} IDProducto={producto} onDeleteProducto={onCreateProducto} />
    </Container>
  );
}

export default Producto;