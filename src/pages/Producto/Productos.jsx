//-------------------------------------------------Imports generales--------------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./estilos.css";
import "bootstrap/dist/css/bootstrap.min.css";
//-------------------------------------------------Imports Modals------------------------------------------------------------------------
import ModalA from "../../components/modal-editar/modal-editar-departamentos";
import ModalCrear from "../../components/modal-crear/modal-crear-departamentos";
import ModalEliminar from "../../components/modal-eliminar/modal-eliminar-departamento";
import CustomAlert from '../../components/alert/alert';
//-------------------------------------------------Imports Firebase----------------------------------------------------------------------
import { Table, Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
//-------------------------------------------------Imports Fontawesome---------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretUp, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faCartFlatbed } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft, faCaretUp);
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
  useEffect(() => {obtenerProducto(1);}, []);
  //----------------------------------------------Editar------------------------------------------------------------------------------------------------
  const fieldOrderEditar = {
    1: "Nombre",
    2: "Precio",
    3: "Descripcion",
    4: "Image",
    5: "Cantidad",
  };
  const abrirModalActualizar = (cedula) => {
    setTextoAlert("Producto modificado con éxito");
    setTipoAlert("success");
    setProducto(cedula);
    openModalActualizar();
  };
  const editar = async (form) => {
    const q = query(collection(db, "Producto"), where("CodigoBarras", "==", producto.CodigoBarras));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      encontrado = doc.id;
    });
    try {
      const department = doc(db, "Producto", encontrado);
      console.log(departamento)

      await updateDoc(department, {
        Nombre: form.Nombre,
        Precio: parseFloat(form.Precio), // Si no se puede convertir, asigna 0
        Cantidad: parseFloat(form.Cantidad),
        Estado: form.Estado,
        Image: form.Image,
        Descripcion: form.Descripcion
      });
      console.log("Document successfully updated!");
      onCreateProducto();

    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  //-----------------------------------------------------Ver-------------------------------------------------------
  const [searchOption, setSearchOption] = useState("Nombre");
  const filteredUsers = dataState.filter((departamento) => {
    const searchTerm = searchQuery;
    if (searchOption === "Nombre") {
      return departamento.Nombre.includes(searchTerm);
    } if (searchOption === "Marca") {
      return departamento.Marca.includes(searchTerm);
    } if (searchOption === "Departamento") {
      return departamento.NombreDepartamento.includes(searchTerm);
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
        .filter((product) => product.Estado !== "Eliminado");
      // Filtrar productos con estado "Eliminado"
      // Calcular el conjunto de productos para la página actual
      const slicedProducts = allProducts.slice(startIndex, startIndex + usersPerPage);

      setData(slicedProducts); // Actualizar el estado de datos con los productos obtenidos
    } catch (error) {
      console.error("Error al obtener productos: ", error);
    }
  };
  useEffect(() => {obtenerDepartamentos();}, [isOpenCrear]);
  const obtenerDepartamentos = async () => {
    try {
      const userRef = collection(db, "Departamento");
      const userSnapshot = await getDocs(userRef);
      const allDepartmentos = userSnapshot.docs
        .map((departament) => departament.data())
      setDepartamento(allDepartmentos);
    } catch (error) {
      console.error("Error al obtener departamentos: ", error);
    }
  };
  const onCreateProducto = () => {obtenerProducto(1);};
  //-------------------------------------------------------------Crear------------------------------------------------------------------------
  const fieldOrderCrear = {
    1: "Nombre",
    2: "Marca",
    3: "Codigo de Barras",
    4: "Descripcion",
    5: "Nombre del Departamento",
    6: "Precio",
    7: "Precio de Referencia",
    8: "Cantidad",
    9: "Image",
  };
  const validateFieldCrear = (fieldName, value) => {
    const errors = {};
    let fieldErrors = { ...errors };
  
    switch (fieldName) {
      case "Precio":
        fieldErrors.Precio =
          isNaN(Number(value)) || Number(value) < 0
            ? "El precio debe ser un número positivo"
            : "";
        break;
      case "Precio de Referencia":
        fieldErrors.PrecioReferencia =
          isNaN(Number(value)) || Number(value) < 0
            ? "El precio de referencia debe ser un número positivo"
            : "";
        break;
      case "Cantidad":
        fieldErrors.Cantidad =
          isNaN(Number(value)) || Number(value) < 0
            ? "La cantidad debe ser un número positivo"
            : "";
        break;
      case "Codigo de Barras":
        fieldErrors.CodigoBarras =
          isNaN(Number(value)) || value.length < 6
            ? "El código de barras debe ser un número con al menos 6 dígitos"
            : "";
        break;
      default:
        break;
    }
  
    return fieldErrors;
  };
  
  const crearProducto = async (form) => {
    try {
      await addDoc(collection(db, "Producto"), {
        Nombre: form.Nombre,
        CodigoBarras: parseFloat(form.CodigoBarras),
        Precio: parseFloat(form.Precio),
        Marca: form.Marca,
        Cantidad: parseFloat(form.Cantidad),
        Estado: "Disponible",
        NombreDepartamento: form.NombreDepartamento,
        PrecioReferencia: parseFloat(form.PrecioReferencia),
        Image: form.Image,
        Descripcion: form.Descripcion,
        PrecioLiquidacion: 0
      });

      console.log("Producto creado y documentado en Firestore");
      onCreateProducto();
    } catch (error) {
      console.error("Error al crear producto y documentar en Firestore: ", error);
    }
  };

  const initialFormState = {
    Nombre: '',
    Precio: 0,
    Cantidad: '',
    Image: '',
    Descripcion: '',
    PrecioReferencia: 0,
    NombreDepartamento: '',
    CodigoBarras: 0,
    Marca: '',
  };

  //-------------------------------------------------------Eliminar---------------------------------------------------------------------
  const abrirModalEliminar = (id) => {
    setProducto(id);
    console.log(id);
    openModalEliminar();
  };
  const eliminarProducto = async () => {
    const q = query(collection(db, "Producto"), where("CodigoBarras", "==", producto.CodigoBarras));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      encontrado = doc.id;
    });
    try {
      const department = doc(db, "Producto", encontrado);
      console.log(departamento)

      await updateDoc(department, {
        Estado: "Eliminado"
      });
      console.log("Estado del producto cambiado correctamente");
      onCreateProducto();
    } catch (error) {
      console.error("Error al cambiar el estado del producto: ", error);
    }
  };
  const agregarProductoAFactura = (pro) => {
    return pro;
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
      <label>Buscar por:</label>
      <select
        value={searchOption}
        onChange={(e) => handleSearchOptionChange(e)}
      >
        <option value="Nombre">Nombre</option>
        <option value="Departamento">Departamento</option>
        <option value="Marca">Marca</option>
      </select>
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Departamento</th>
            <th>Estado</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th>Descripción</th>
            <th>Codigo</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((dato) => (
            <tr key={dato.Nombre}>
              <td>{dato.Nombre}</td>
              <td>{dato.Marca}</td>
              <td>{dato.NombreDepartamento}</td>
              <td>{dato.Estado}</td>
              <td>{dato.Cantidad}</td>
              <td>{dato.Precio}</td>
              <td>
                <img src={dato.Image} alt={dato.Nombre} style={{ width: '30px', height: '30px' }} />
              </td>
              <td>{dato.Descripcion}</td>
              <td>{dato.CodigoBarras}</td>
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
                <Button
                  onClick={() => agregarProductoAFactura(dato)}
                  color="primary">
                  <FontAwesomeIcon icon={faCartFlatbed} size="lg" />
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
        combobox2={departamento}
      />
      <ModalCrear
        isOpenA={isOpenCrear}
        closeModal={closeModalCrear}
        onCreateUsuario={onCreateProducto}
        validateField={validateFieldCrear}
        FuntionCreate={crearProducto}
        initialForm={initialFormState}
        fieldOrder={fieldOrderCrear}
        nombreCrud={nombre}
        combobox2={departamento}
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