import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import appFirebase from "../../firebase/firebase.js"; // Llama a donde tengo la configuracion de la aplicacion que usa la base
import { getFirestore } from "firebase/firestore"; // Llamo lo que necesito usar para la los metodos de traer docs etc
import { collection, getDocs } from "firebase/firestore";
import ModalEliminarP from "../../components/Eliminar/ModalEliminar";
import "bootstrap/dist/css/bootstrap.min.css";
import {Table,Button,Container} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ModalCrearP from "../../components/Crear producto/ModaloCrearP";
import ModalEP from "../../components/EditarProducto/ModalEditarP";
import './estilos.css';
library.add(faPenToSquare,faSquareXmark);

function Producto() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    obtenerProductos(1); // Fetch the first page of users
  }, []);
  const [IdProducto, setIdProducto] = useState(0);
  const db = getFirestore(appFirebase); // Inicializo la base de datos en la aplicacion web
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] = useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] = useModal(false);
  const [dataState, setData] = useState([]);
  
  const abrirModalActualizar = (id) => {
    console.log(IdProducto);
    setIdProducto(id);
    console.log(id);
    openModalActualizar();
  };
  const abrirModalEliminar = (id) => {
    setIdProducto(id);
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

      <ModalEP isOpenED={isOpenActualizar} closeModal={closeModalActualizar} IDProducto={IdProducto} onCreateProducto={onCreateProducto}/>
      <ModalCrearP isOpenA={isOpenCrear} closeModal={closeModalCrear} onCreateDepartamento={onCreateProducto}/>
      <ModalEliminarP isOpenD={isOpenEliminar} closeModal={closeModalEliminar} IDProducto={IdProducto} onDeleteProducto={onCreateProducto}/>
    </Container>
  );
}

export default Producto;