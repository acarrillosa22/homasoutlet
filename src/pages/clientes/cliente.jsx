import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./clientes.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalCrear from "../../components/modal-crear/modal-crear-departamentos";
import ModalA from "../../components/modal-editar/modal-editar-departamentos";
import ModalEliminar from "../../components/modal-eliminar/modal-eliminar-departamento";
//Firebase
import { Table, Button, Container } from "reactstrap";
import appFirebase from "../../firebase/firebase"; // Llama a donde tengo la configuracion de la aplicacion que usa la base
import { getFirestore } from "firebase/firestore"; // Llamo lo que necesito usar para la los metodos de traer docs etc
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
//fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft);

function Clientes() {
  const nombre = "Cliente";
  const combobox = {
    Admin: "Admin",
    SuperAdmin: "Super Admin",
  };
  const db = getFirestore(appFirebase); // Inicializo la base de datos en la aplicacion web
  const auth = getAuth();
  //hooks
  const [showMorosidadTrue, setShowMorosidadTrue] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usuario, setUsuario] = useState([]);
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] =
    useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] =
    useModal(false);
  const [dataState, setData] = useState([]);
  useEffect(() => {
    obtenerUsuarios(1); // Fetch the first page of users
  }, []);
  //------------------------------------------------------Editar--------------------------------------------------------------------
  const fieldOrderEditar = {
    1: "nombre", // Primer campo en aparecer
    2: "telefono",
    3: "correoElectronico",
    4: "morosidad",
  };
  const abrirModalActualizar = (cedula) => {
    setUsuario(cedula);
    openModalActualizar();
  };
  const validateField = (fieldName, value) => {
    const errors = {};
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "contrasena":
        fieldErrors.contrasena =
          value.length < 6
            ? "La contraseña debe tener al menos 6 caracteres"
            : "";
        break;
      case "telefono":
        fieldErrors.telefono =
          value.length !== 8 || isNaN(Number(value))
            ? "El teléfono debe tener 8 números y ser solo números"
            : "";
        break;
      default:
        break;
    }

    return fieldErrors;
  };
  const editar = async (form) => {
    const cedula = usuario.idUser;
    console.log(cedula);
    console.log(usuario.correoElectronico);
    try {
      const user = doc(db, "Usuarios", cedula);
      console.log(usuario);
      console.log("Formulario:", form);

      await updateDoc(user, {
        nombre: form.nombre,
        telefono: form.telefono,
        correoElectronico: form.correoElectronico,
        morosidad: form.morosidad,
      });
      console.log("Document successfully updated!");
      onCreateUsuario();
      window.alert("Se creo el Administrador con exito");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------Ver--------------------------------------------------------------------
  const [searchOption, setSearchOption] = useState("nombre");
  const filteredUsers = dataState.filter((user) => {
    const searchTerm = searchQuery.toLowerCase();
    if (searchOption === "nombre") {
      return user.nombre.toLowerCase().includes(searchTerm);
    } else if (searchOption === "cedula") {
      return user.cedula.toLowerCase().includes(searchTerm);
    }
    return false;
  });

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  filteredUsers.map((dato) => <tr key={dato.idUser}></tr>);
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
  const obtenerUsuarios = async (page) => {
    try {
      const usersPerPage = 10; // Number of users to fetch per page
      const startIndex = (page - 1) * usersPerPage;

      const userRef = collection(db, "Usuarios");
      const userSnapshot = await getDocs(userRef);
      const allUsers = userSnapshot.docs
        .map((user) => user.data())

        .filter((user) => user.rol === "Cliente");
      console.log(allUsers);
      const slicedUsers = allUsers.slice(startIndex, startIndex + usersPerPage);

      setData(slicedUsers); // Update the data state with the fetched users
    } catch (error) {
      console.error("Error al obtener usuarios: ", error);
    }
  };

  const onCreateUsuario = () => {
    // Actualizar la lista de usuarios llamando a obtenerUsuarios nuevamente
    obtenerUsuarios(1);
  };
  //-------------------------------------------------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------Crear------------------------------------------------------------------------
  const fieldOrderCrear = {
    1: "cedula",
    2: "nombre", // Primer campo en aparecer
    3: "contrasena",
    4: "telefono",
    5: "correoElectronico",
  };
  const validateFieldCrear = (fieldName, value) => {
    const errors = {};
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "cedula":
        fieldErrors.cedula =
          value.length !== 9 || isNaN(Number(value))
            ? "La cédula debe tener 9 caracteres y ser solo números"
            : "";
        break;
      case "contrasena":
        fieldErrors.contrasena =
          value.length < 6
            ? "La contraseña debe tener al menos 6 caracteres"
            : "";
        break;
      case "telefono":
        fieldErrors.telefono =
          value.length !== 8 || isNaN(Number(value))
            ? "El teléfono debe tener 8 números y ser solo números"
            : "";
        break;
      default:
        break;
    }

    return fieldErrors;
  };
  const crearUsuario = async (form) => {
    try {
      // Crear usuario en Firebase Authentication
      console.log(form.correo);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.correoElectronico,
        form.contrasena
      );
      // Obtener el ID de usuario del usuario creado
      const idUser = userCredential.user.uid;
      console.log(idUser);
      // Agregar información del usuario a Firestore
      await setDoc(doc(db, "Usuarios", idUser), {
        idUser: idUser,
        nombre: form.nombre,
        correoElectronico: form.correoElectronico,
        contraseña: form.contrasena,
        estado: true,
        morosidad: false,
        cedula: form.cedula,
        rol: "Cliente",
        telefono: form.telefono,
        limiteDeCredito: 0,
        ultimaConexion: "",
        direccionExacta: {
          provincia: "",
          canton: "",
          distrito: "",
          direccionCompleta: "",
        },
        historialPedidos: {},
      });

      console.log("Usuario creado y documentado en Firestore");
      onCreateUsuario();
      window.alert("Se creo el Administrador con exito");
    } catch (error) {
      console.error(
        "Error al crear usuario y documentar en Firestore: ",
        error
      );
    }
  };

  const initialFormState = {
    cedula: "",
    nombre: "",
    contrasena: "",
    telefono: "",
    correo: "",
    rol: "",
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //-------------------------------------------------------Eliminar---------------------------------------------------------------------

  const abrirModalEliminar = (cedula) => {
    setUsuario(cedula);
    openModalEliminar();
  };
  const eliminarUsuario = async () => {
    try {
      // Eliminar el usuario de Firebase y Firestore
      await deleteDoc(doc(db, "Usuarios", usuario.idUser));
      console.log("Usuario eliminado correctamente");
      onCreateUsuario();
      window.alert("Se elimino el Administrador");
    } catch (error) {
      console.error("Error al eliminar usuario: ", error);
    }
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  return (
    <Container>
      <h1>Clientes</h1>
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
      <select
        className="select-styled"
        value={searchOption}
        onChange={handleSearchOptionChange}
      >
        <option value="nombre">Nombre</option>
        <option value="cedula">Cédula</option>
      </select>
      
      <label htmlFor="showMorosidadTrue">Solo Morosos</label>
      <input
        type="checkbox"
        checked={showMorosidadTrue}
        onChange={() => setShowMorosidadTrue(!showMorosidadTrue)}
      />
      <Table>
        <thead>
          <tr>
            <th>Cedula</th>
            <th>Nombre</th>
            <th>Telefono</th>
            <th>Coreo Electronico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers
            .filter(
              (user) =>
                (!showMorosidadTrue || user.morosidad) &&
                (searchOption === "nombre"
                  ? user.nombre
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  : user.cedula
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()))
            )
            .map((dato) => (
              <tr
                key={dato.idUser}
                className={dato.morosidad ? "table-danger" : ""}
              >
                <td>{dato.cedula}</td>
                <td>{dato.nombre}</td>
                <td>{dato.telefono}</td>
                <td>{dato.correoElectronico}</td>
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
        elemento={usuario}
        validateField={validateField}
        FuntionEdit={editar}
        fieldOrder={fieldOrderEditar}
        nombreCrud={nombre}
      />
      <ModalCrear
        isOpenA={isOpenCrear}
        closeModal={closeModalCrear}
        onCreateUsuario={onCreateUsuario}
        validateField={validateFieldCrear}
        FuntionCreate={crearUsuario}
        initialForm={initialFormState}
        fieldOrder={fieldOrderCrear}
        Combobox={combobox}
        nombreCrud={nombre}
      />
      <ModalEliminar
        isOpen={isOpenEliminar}
        closeModal={closeModalEliminar}
        nombre={usuario.nombre}
        funtionDelete={eliminarUsuario}
        nombreCrud={nombre}
      />
    </Container>
  );
}

export default Clientes;
