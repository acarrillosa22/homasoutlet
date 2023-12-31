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
import localForage from 'localforage';
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
import TopNavBar from "../../components/navbarC/navbar";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft, faCaretUp);
const nombre = "Producto";
//------------------------------------------------Inicio de funcion----------------------------------------------------------------------------
function Producto() {
  const db = getFirestore(appPVH);
  //----------------------------------------------Hooks varios--------------------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [producto, setProducto] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState("");
  const [tipoAlert, setTipoAlert] = useState("");
  const [departamento, setDepartamento] = useState([]);
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] = useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] = useModal(false);
  const [dataState, setData] = useState([]);
  let encontrado = '';
  useEffect(() => { obtenerProducto(1); }, []);
  //----------------------------------------------Editar------------------------------------------------------------------------------------------------
  const fieldOrderEditar = {
    1: "Nombre",
    2: "Precio",
    3: "PrecioReferencia",
    4: "Descripcion",
    5: "Cantidad",
    6: "NombreDepartamento",
    7: "Image",
  };

  const Etiquetas = {
    Nombre: "Nombre",
    Marca: "Marca",
    CodigoBarras: "Código de Barras",
    Descripcion: "Descripción",
    NombreDepartamento: "Nombre del Departamento",
    Precio: "Precio",
    PrecioReferencia: "Costo",
    Cantidad: "Cantidad"
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
      if (imageFile !== null) {
        await updateDoc(department, {
          Nombre: form.Nombre,
          Precio: parseFloat(form.Precio),
          PrecioReferencia: parseFloat(form.PrecioReferencia),
          Cantidad: parseFloat(form.Cantidad),
          NombreDepartamento: form.NombreDepartamento,
          Image: imageFile,
          Estado: form.Estado,
          Descripcion: form.Descripcion
        });
      }
      else {
        await updateDoc(department, {
          Nombre: form.Nombre,
          Precio: parseFloat(form.Precio), 
          PrecioReferencia: parseFloat(form.PrecioReferencia),
          Cantidad: parseFloat(form.Cantidad),
          NombreDepartamento: form.NombreDepartamento,
          Estado: form.Estado,
          Descripcion: form.Descripcion
        });
      }
      onCreateProducto();
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
      setImageFile(null);
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
    } else if (searchOption === "Marca") {
      return departamento.Marca.includes(searchTerm);
    } else if (searchOption === "Departamento") {
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
  const [orderOption, setOrderOption] = useState("Precio"); // Nuevo estado para la opción de ordenar
  const handleOrder = (event) => {
    setOrderOption(event.target.value);
    ordenarPor(event.target.value);
  };
  const ordenarPor = (option) => {
    const allProducts = [...dataState];
    if (option === 'Precio') {
      allProducts.sort((a, b) => a.Precio - b.Precio);
    } else if (option === 'Cantidad') {
      allProducts.sort((a, b) => a.Cantidad - b.Cantidad);
    }
    setData(allProducts);
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
        .filter((product) => product.Estado !== 1);
      // Filtrar productos con estado "Eliminado"
      // Calcular el conjunto de productos para la página actual
      const slicedProducts = allProducts.slice(startIndex, startIndex + usersPerPage);

      setData(slicedProducts); // Actualizar el estado de datos con los productos obtenidos
    } catch (error) {
      console.error("Error al obtener productos: ", error);
    }
  };
  useEffect(() => { obtenerDepartamentos(); }, [isOpenCrear]);
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
  const onCreateProducto = () => { obtenerProducto(1); };
  //-------------------------------------------------------------Crear------------------------------------------------------------------------
  const fieldOrderCrear = {
    1: "Nombre",
    2: "Marca",
    3: "CodigoBarras",
    4: "Descripcion",
    5: "NombreDepartamento",
    6: "Precio",
    7: "PrecioReferencia",
    8: "Cantidad",
    9: "Image",
  };

  const EtiquetasCrear = {
    Nombre: "Nombre",
    Marca: "Marca",
    CodigoBarras: "Código de Barras",
    Descripcion: "Descripción",
    NombreDepartamento: "Nombre del Departamento",
    Precio: "Precio",
    PrecioReferencia: "Costo",
    Cantidad: "Cantidad",
    Image: "Imagen"
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
      case "PrecioReferencia":
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
      case "CodigoBarras":
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
        Estado: 0,
        NombreDepartamento: form.NombreDepartamento,
        PrecioReferencia: parseFloat(form.PrecioReferencia),
        Image: imageFile,
        Descripcion: form.Descripcion,
        PrecioLiquidacion: 0,
        CantidaVendidos: 0
      });
      onCreateProducto();
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
      setImageFile(null);
    } catch (error) {
      console.error("Error al crear producto y documentar en Firestore: ", error);
    }
  };

  const initialFormState = {
    Nombre: '',
    Precio: 0,
    Cantidad: 0,
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
    setTextoAlert("Producto Eliminado con éxito");
    setTipoAlert("success");
    openModalEliminar();
  };
  const eliminarProducto = async () => {
    const q = query(collection(db, "Producto"), where("CodigoBarras", "==", producto.CodigoBarras));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      encontrado = doc.id;
    });
    try {
      const department = doc(db, "Producto", encontrado);
      await updateDoc(department, {
        Estado: 1
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
      onCreateProducto();
    } catch (error) {
      console.error("Error al cambiar el estado del producto: ", error);
    }
  };
  const agregarProducto = (tabs, e, t) => {
    const updatedTabs = [...tabs];
    // En caso de que se este añadiendo otro producto igual
    const activeTabData = updatedTabs[t].content;
    const existingProductIndex = activeTabData.productos.findIndex(
      (producto) => producto.codigoBarras === parseInt(e.codigoBarras)
    );

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, actualiza la cantidad
      if (activeTabData.productos[existingProductIndex].existencia > activeTabData.productos[existingProductIndex].Cantidad) {
        updatedTabs[t].content.productos[existingProductIndex].Cantidad++;
      }
    } else {
      const newProducto = {
        codigoBarras: e.CodigoBarras,
        descripcion: e.Descripcion,
        Precio: e.Precio,
        departamento: e.NombreDepartamento,
        Cantidad: 1,
        importe: 0,
        costo: e.PrecioReferencia,
        vT: e.CantidaVendidos,
        existencia: e.Cantidad,
        descuento: 0,
        Nombre: e.Nombre
      };
      // Actualiza el estado de las pestañas directamente
      updatedTabs[t].content.productos.push(newProducto);
    }
    localForage.setItem('facturas', updatedTabs);
  };
  const agregarProductoAFactura = async (pro) => {
    const tablas = await localForage.getItem('facturas');
    const ta = localStorage.getItem('ta');
    if (tablas.length === 1) {
      agregarProducto(tablas, pro, 0)
    } else {
      agregarProducto(tablas, pro, parseFloat(ta))
    }
  };
  //---------------------------------------------------------HTML-------------------------------------------------------------
  return (
    <Container>
      <TopNavBar />
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
      <label>Ordenar por:</label>
      <select
        value={orderOption}
        onChange={(e) => handleOrder(e)}
      >
        <option value="Precio">Precio</option>
        <option value="Cantidad">Cantidad</option>
      </select>
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Departamento</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Costo</th>
            <th>Imagen</th>
            <th>Descripción</th>
            <th>Código</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((dato) => (
            <tr key={dato.Nombre}>
              <td>{dato.Nombre}</td>
              <td>{dato.Marca}</td>
              <td>{dato.NombreDepartamento}</td>
              <td>{dato.Cantidad}</td>
              <td>{dato.Precio}</td>
              <td>{dato.PrecioReferencia}</td>
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
        setImageFile={setImageFile}
        Etiquetas={Etiquetas}
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
        setImageFile={setImageFile}
        Etiquetas={EtiquetasCrear}
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