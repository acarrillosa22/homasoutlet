//-------------------------------------------------Imports generales--------------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./departamentos.css";
import "bootstrap/dist/css/bootstrap.min.css";
//-------------------------------------------------Imports Modals------------------------------------------------------------------------
import ModalA from "../../components/modal-editar/modal-editar-departamentos";
import ModalCrear from "../../components/modal-crear/modal-crear-departamentos";
import ModalEliminar from "../../components/modal-eliminar/modal-eliminar-departamento";
//-------------------------------------------------Imports Firebase----------------------------------------------------------------------
import { Table, Button, Container } from "reactstrap";
import appFirebase from "../../firebase/firebase.js";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
//-------------------------------------------------Imports Fontawesome---------------------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare, faSquareXmark,faArrowRight,faArrowLeft);
const nombre = "Departamento";

//------------------------------------------------Inicio de funcion----------------------------------------------------------------------------
function Departamentos() {
  const db = getFirestore(appFirebase);
  //----------------------------------------------Hooks varios--------------------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [departamento, setDepartamento] = useState([]);
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] = useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] = useModal(false);
  const [dataState, setData] = useState([]);
  let encontrado = '';
  useEffect(() => {
    obtenerDepartamentos(1); // Fetch the first page of departments
  }, []);
  //----------------------------------------------Editar------------------------------------------------------------------------------------------------
  const fieldOrderEditar = {
    1: "Nombre", // Primer campo en aparecer
    2: "EstadoD",
    3: "Descripcion",
  };
  const abrirModalActualizar = (nombre) => {
    setDepartamento(nombre);
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

    return(fieldErrors);
  };

  const editar = async (form) => {
    const q = query(collection(db, "Departamento"), where("Nombre", "==", departamento.Nombre));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      encontrado =  doc.id;
    });
    try {
      const department = doc(db, "Departamento", encontrado);
      console.log(departamento)
      console.log('Formulario:', form);

      await updateDoc(department, {
        Nombre: form.Nombre,
        Estado: form.EstadoD,  
        Descripcion: form.Descripcion,  
      });
      console.log("Document successfully updated!");
      onCreateDepartamentos();

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
    } else 
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
      console.log(departamento);
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
      console.error("Error al obtener departamentos: ", error);
    }
  };
  
  const onCreateDepartamentos = () => {
    // Actualizar la lista de usuarios llamando a obtenerUsuarios nuevamente
    obtenerDepartamentos(1);
  };
//-------------------------------------------------------------Crear------------------------------------------------------------------------
const fieldOrderCrear = {
  1: "Nombre", // Primer campo en aparecer
  2: "Estado",
  3: "Descripcion",
  4: "Imagen"
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

  return(fieldErrors);
};
const crearDepartamento = async (form) => {
  try {
    // Crear usuario en Firebase Authentication
    // Obtener el ID de usuario del usuario creado
    // Agregar información del usuario a Firestore

    console.log(db);
    console.log(imageFile);
    await addDoc(collection(db, "Departamento"), {
      Nombre: form.Nombre,
      Estado: form.Estado,
      Imagen: imageFile,
      Descripcion: form.Descripcion,
      Ventas:["",0,""]
    });

    console.log("Departamento creado y documentado en Firestore");
    onCreateDepartamentos();
  } catch (error) {
    console.error("Error al crear departamento y documentar en Firestore: ", error);
  }
};

const initialFormState = {
  Nombre: "",
  Estado: "",
  Descripcion: ""
};

//-------------------------------------------------------Eliminar---------------------------------------------------------------------

const abrirModalEliminar = (nombre) => {
  setDepartamento(nombre);
  openModalEliminar();
};
const eliminarDepartamento = async () => {
  try {
    // Eliminar el usuario de Firebase y Firestore
    const q = query(collection(db, "Departamento"), where("Nombre", "==", departamento.Nombre));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      encontrado =  doc.id;
    });

    await deleteDoc(doc(db, "Departamento", encontrado));
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
    <h1>Departamentos
    </h1>
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
  <Table>
  <thead>
        <tr>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Imagen</th>
          <th>Descripcion</th>
        </tr>
      </thead>
    <tbody>
      {filteredUsers.map((dato) => (
        <tr key={dato.Nombre}>
          <td>{dato.Nombre}</td>
          <td>{dato.Estado}</td>
          <td>
                <img src={dato.Imagen} alt={dato.Nombre} style={{ width: '30px', height: '30px' }} />
          </td>
          <td>{dato.Descripcion}</td>
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
      elemento={departamento}
      validateField ={validateField}
      FuntionEdit={editar}
      fieldOrder={fieldOrderEditar}
      nombreCrud={nombre}
    />
    <ModalCrear
      isOpenA={isOpenCrear}
      closeModal={closeModalCrear}
      onCreateUsuario={onCreateDepartamentos}
      validateField={validateFieldCrear}
      FuntionCreate={crearDepartamento}
      initialForm={initialFormState}
      fieldOrder={fieldOrderCrear}
      nombreCrud={nombre}
      setImageFile={setImageFile}
    />
    <ModalEliminar
      isOpen={isOpenEliminar}
      closeModal={closeModalEliminar}
      nombre={departamento.Nombre}
      funtionDelete={eliminarDepartamento}
      nombreCrud={nombre}
    />
  </Container>
  );
}

export default Departamentos;