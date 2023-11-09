//-------------------------------------------------Imports generales--------------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./estilos.css";
import "bootstrap/dist/css/bootstrap.min.css";
//-------------------------------------------------Imports Modals------------------------------------------------------------------------
import ModalA from "../../components/modal-editar/modal-editar-departamentos";
import ModalCrear from "../../components/modal-crear/modal-crear-departamentos";
import ModalEliminar from "../../components/modal-eliminar/modal-eliminar-departamento";
//-------------------------------------------------Imports Firebase----------------------------------------------------------------------
import { Table, Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import CustomAlert from '../../components/alert/alert';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
//-------------------------------------------------Imports Fontawesome---------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft);
const nombre = "Producto";
//------------------------------------------------Inicio de funcion----------------------------------------------------------------------------
function Producto() {
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
  let encontrado = '';
  useEffect(() => {
    obtenerProducto(1); // Fetch the first page of departments
  }, []);
  //----------------------------------------------Editar------------------------------------------------------------------------------------------------

  const fieldOrderEditar = {
    1: "Nombre", // Primer campo en aparecer
    2: "Precio",
    3: "Descripcion",
    4: "Image",
    5: "Cantidad",
  };
  const abrirModalActualizar = (cedula) => {
    setTextoAlert("Cliente modificado con éxito");
    setTipoAlert("success");
    setProducto(cedula);
    openModalActualizar();
  };
  const [sortBy, setSortBy] = useState('');
  const editar = async (form, productoId) => {
    const docRef = doc(db, "Producto", productoId);

    try {
      await updateDoc(docRef, {
        Nombre: form.Nombre,
        Precio: form.precio,
        Marca: form.marca,
        Cantidad: form.cantidad,
        Estado: "Disponible",
        Image: form.imagen,
        Descripcion: form.descripcion
      });
      console.log("Documento actualizado exitosamente");
      onCreateDepartamentos();
    } catch (error) {
      console.error("Error al actualizar el documento: ", error);
    }
  };

  //-----------------------------------------------------Ver-------------------------------------------------------
  const [searchOption, setSearchOption] = useState("Nombre");
  const filteredUsers = dataState.filter((departamento) => {
    const searchTerm = searchQuery;
    if (searchOption === "Nombre") {
      return departamento.Nombre.includes(searchTerm);
    } if (searchOption === "Marca") {
      return departamento.Nombre.includes(searchTerm);
    } if (searchOption === "Departamento") {
      return departamento.Nombre.includes(searchTerm);
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

  filteredUsers.map((dato) => (
    <tr key={dato.Nombre}>
    </tr>
  ));
  const handleNextPage = () => {
    // Increment the page and fetch the next page of users
    obtenerProducto(currentPage + 1);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // Decrement the page and fetch the previous page of users
      obtenerProducto(currentPage - 1);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const obtenerProducto = async (page) => {
    try {
      const usersPerPage = 10; // Número de productos para obtener por página
      const startIndex = (page - 1) * usersPerPage;

      const userRef = collection(db, "Producto");
      const userSnapshot = await getDocs(userRef);
      const allProducts = userSnapshot.docs
        .map((product) => product.data())
        .filter((product) => product.Estado !== "Eliminado"); // Filtrar productos con estado "Eliminado"

      // Calcular el conjunto de productos para la página actual
      const slicedProducts = allProducts.slice(startIndex, startIndex + usersPerPage);

      setData(slicedProducts); // Actualizar el estado de datos con los productos obtenidos
    } catch (error) {
      console.error("Error al obtener productos: ", error);
    }
  };

  const obtenerDepartamentos = async (page) => {
    try {
      const userRef = collection(db, "Departamento");
      const userSnapshot = await getDocs(userRef);
      const allDepartmentos = userSnapshot.docs
        .map((departament) => departament.data())
    } catch (error) {
      console.error("Error al obtener departamentos: ", error);
    }
  };
  const onCreateDepartamentos = () => {
    // Actualizar la lista de usuarios llamando a obtenerUsuarios nuevamente
    obtenerProducto(1);
  };
  //-------------------------------------------------------------Crear------------------------------------------------------------------------
  const fieldOrderCrear = {
    1: "Nombre",
    2: "Marca",
    3: "Codigo",
    4: "Descripcion",
    5: "Departamento",
    6: "Precio",
    7: "PrecioReferencia",
    8: "Cantidad",
    9: "Image",
  };
  const validateFieldCrear = (fieldName, value) => {
    const errors = {}
    let fieldErrors = { ...errors };
    switch (fieldName) {
      case "precio":
        fieldErrors.precio =
          isNaN(Number(value))
            ? "El precio debe ser un numero"
            : "";
        break;
      case "precioReferencia":
        fieldErrors.precioReferencia =
          isNaN(Number(value))
            ? "El precio de referencia debe ser un numero"
            : "";
        break;
      case "cantidad":
        fieldErrors.cantidad =
          isNaN(Number(value))
            ? "La cantidad debe ser un numero"
            : "";
        break;
      case "codigo":
        fieldErrors.estado =
          isNaN(Number(value))
            ? "El codigo debe ser un numero"
            : "";
        break;
      default:
        break;
    }
    return (fieldErrors);
  };
  const crearProducto = async (form) => {
    const errors = {};
    // Validar campos vacíos
    if (!form.nombre) {
      errors.nombre = "El nombre es requerido";
    }
    if (!form.codigo) {
      errors.codigo = "El código es requerido";
    }
    if (!form.precio) {
      errors.precio = "El precio es requerido";
    }
    if (!form.cantidad) {
      errors.cantidad = "El cantidad es requerido";
    }
    if (!form.marca) {
      errors.marca = "El marca es requerido";
    }
    if (!form.departamento) {
      errors.departamento = "El departamento es requerido";
    } if (!form.imagen) {
      errors.imagen = "El imagen es requerido";
    }
    if (!form.precioReferencia) {
      errors.precioReferencia = "El precioReferencia es requerido";
    }
    if (!form.descripcion) {
      errors.descripcion = "El descripcion es requerido";
    }
    // Comprobar si hay errores
    if (Object.keys(errors).length > 0) {
      console.log("Campos requeridos vacíos:", errors);
      return;
    }

    try {
      await addDoc(collection(db, "Producto"), {
        Nombre: form.nombre,
        Id: form.codigo,
        Precio: form.precio,
        Marca: form.marca,
        Cantidad: form.cantidad,
        Estado: "Disponible",
        NombreDepartamento: form.departamento,
        PrecioReferencia: form.precioReferencia,
        Image: form.imagen,
        Descripcion: form.descripcion
      });

      console.log("Producto creado y documentado en Firestore");
      onCreateDepartamentos();
    } catch (error) {
      console.error("Error al crear producto y documentar en Firestore: ", error);
    }
  };

  const initialFormState = {
    nombre: '',
    precio: '',
    cantidad: '',
    imagen: '',
    descripcion: ''
  };

  //-------------------------------------------------------Eliminar---------------------------------------------------------------------
  const abrirModalEliminar = (id) => {
    setProducto(id);
    console.log(id);
    openModalEliminar();
  };
  const eliminarProducto = async (productoId) => {
    const docRef = doc(db, "Producto", productoId);
    try {
      await updateDoc(docRef, {
        Estado: "Eliminado" // Cambiar el estado del producto a "No Disponible"
      });
      console.log("Estado del producto cambiado correctamente");
      onCreateDepartamentos();
    } catch (error) {
      console.error("Error al cambiar el estado del producto: ", error);
    }
  };


  //---------------------------------------------------------HTML-------------------------------------------------------------
  return (
    <Container>
      <h1>Producto</h1>
      <br />
      <Button onClick={openModalCrear} color="success">
        Crear
      </Button>
      <br />
      <br />
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={`Buscar por ${searchOption}`}
      />
      <label>Ordenar por:</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="">Sin ordenar</option>
        <option value="Precio">Precio</option>
        <option value="Cantidad">Cantidad</option>
      </select>
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
          {filteredUsers.map((dato) => (
            <tr key={dato.Nombre}>
              <td>{dato.Nombre}</td>
              <td>{dato.Estado}</td>
              <td>{dato.Cantidad}</td>
              <td>{dato.Precio}</td>
              <td>
                <img src={dato.Image} alt={dato.Nombre} style={{ width: '30px', height: '30px' }} />
              </td>
              <td>{dato.Descripcion}</td>
              <td>
                <Button
                  onClick={() => abrirModalActualizar(dato)}
                  color="primary">
                  <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                </Button>
                <Button
                  onClick={() => abrirModalEliminar(dato)}
                  color="danger">
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
        elemento={producto}
        validateField={validateFieldCrear}
        FuntionEdit={editar}
        fieldOrder={fieldOrderEditar}
        nombreCrud={nombre}
      />
      <ModalCrear
        isOpenA={isOpenCrear}
        closeModal={closeModalCrear}
        onCreateUsuario={onCreateDepartamentos}
        validateField={validateFieldCrear}
        FuntionCreate={crearProducto}
        initialForm={initialFormState}
        fieldOrder={fieldOrderCrear}
        nombreCrud={nombre}
      />
      <ModalEliminar
        isOpen={isOpenEliminar}
        closeModal={closeModalEliminar}
        nombre={producto.Nombre}
        funtionDelete={eliminarProducto}
        nombreCrud={nombre}
      />
      {showAlert && (<CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />)}
    </Container>
  );
}
export default Producto;