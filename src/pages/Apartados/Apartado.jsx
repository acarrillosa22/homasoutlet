import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalCrear from "../../components/modal-crear/modal-crear-departamentos";
import ModalA from "../../components/modal-editar/modal-editar-departamentos";
import ModalEliminar from "../../components/modal-eliminar/modal-eliminar-departamento";
import CustomAlert from "../../components/alert/alert";
import ModalDetallesFactura from "../../components/datallesModal/modalDetallesFactura";
import ListaAbonoModal from "../../components/datallesModal/listaAbonos";
//Firebase
import { Table, Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import { getDoc, getFirestore } from "firebase/firestore"; // Llamo lo que necesito usar para la los metodos de traer docs etc
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
//fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft, faEye);

function Apartado() {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ""; // Maneja el caso en que el timestamp sea undefined
    const date = new Date(timestamp.seconds * 1000);
    return date.toDateString();
  };
  const nombre = "Cliente";
  const db = getFirestore(appPVH);
  //hooks
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState("");
  const [tipoAlert, setTipoAlert] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] =
    useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] =
    useModal(false);
  const [isOpenDetalles, openModalDetalles, closeModalDetalles] =
    useModal(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dataState, setData] = useState([]);
  const [isOpenListaAbonoModal, openListaAbonoModal, closeListaAbonoModal] =
    useModal(false);
  const [ListaAbono, setListaAbono] = useState([]);
  const [isOpenProductoModal, openProductoModal, closeProductoModal] =
    useModal(false);
  const [Productos, setProductos] = useState([]);

  const [isOpenListaAbono, setIsOpenListaAbono] = useState(false);
  const [isOpenProducto, setIsOpenProducto] = useState(false);
  
  const [usuario, setUsuario] = useState({
    id: "",
    Estado: "",
    fechaLimite: "", // Asegúrate de añadir otros campos necesarios aquí
  });

  useEffect(() => {
    obtenerApartados(1); // Fetch the first page of users
  
    const verificarMorosidad = async (codigo, fechaLimite) => {
      try {
        const today = new Date(); // Obtener la fecha actual del sistema
        const limite = new Date(fechaLimite); // Convertir la fecha límite a un objeto de fecha
  
        if (limite < today) {
          const apartadoRef = doc(db, "Apartado", codigo);
          await updateDoc(apartadoRef, { Estado: "Moroso" });
          console.log("El estado ha sido actualizado a 'moroso' para el apartado con el código:", codigo);
        } else {
          console.log("La fecha límite para el apartado con el código", codigo, "no es anterior a la fecha actual.");
        }
      } catch (error) {
        console.error("Error al verificar morosidad: ", error);
      }
    };
  
    if (usuario && usuario.fechaLimite) {
      verificarMorosidad(usuario.id, usuario.fechaLimite);
    }
  }, [usuario]);
  
  //------------------------------------------------------Editar--------------------------------------------------------------------

  
  const fieldOrderEditar = {
    1: "Estado", // Primer campo en aparecer
    2: "Fecha Limite",
  };

  const EtiquetasEditar = {
    fechaLimite: "Fecha Límite"
  };

  const toggleListaAbonoModal = () => {
    setIsOpenListaAbono(!isOpenListaAbono);
  };

  const toggleProductoModal = () => {
    setIsOpenProducto(!isOpenProducto);
  };
  const abrirModalActualizar = (codigo) => {
    setTextoAlert("Apartado modificado con éxito");
    setTipoAlert("success");
    setUsuario(codigo);
    openModalActualizar();
  };
  const actualizarSaldo = async (codigoApartado, montoAbono) => {
    try {
      const apartadoRef = doc(db, "Apartado", codigoApartado);
      const apartadoDoc = await getDoc(apartadoRef);
      if (apartadoDoc.exists()) {
        const saldoActual = apartadoDoc.data().Saldo;
        const nuevoSaldo = saldoActual - montoAbono;
        await updateDoc(apartadoRef, { Saldo: nuevoSaldo });
      } else {
        console.log("No se encontró el apartado con el código proporcionado.");
      }
    } catch (error) {
      console.error("Error al actualizar el saldo: ", error);
    }
  };
  const agregarNuevoAbono = async (codigoApartado, nuevoMonto) => {
    try {
      const abonoRef = doc(db, "Apartado", codigoApartado);
      const listaAbonos = await getDoc(abonoRef);
      if (listaAbonos.exists()) {
        const listaAbonoData = listaAbonos.data().listaAbono || [];
        const updatedListaAbono = [...listaAbonoData, { Fecha: new Date(), Monto: nuevoMonto }];
        await updateDoc(abonoRef, { listaAbono: updatedListaAbono });
  
        // Llamar a la función de actualización de saldo
        await actualizarSaldo(codigoApartado, nuevoMonto);
      } else {
        console.log("No se encontró el apartado con el código proporcionado.");
      }
    } catch (error) {
      console.error("Error al agregar el nuevo abono: ", error);
    }
  };
  const agregarAbono = async (codigoApartado, montoAbono) => {
  try {
    await agregarNuevoAbono(codigoApartado, montoAbono);
    console.log("Nuevo abono agregado con éxito.");
  } catch (error) {
    console.error("Error al agregar el abono: ", error);
  }
};

// Llamada a la función para agregar un nuevo abono con un código de apartado y un monto específicos
agregarAbono("codigoApartadoEjemplo", 100); // Aquí debes reemplazar "codigoApartadoEjemplo" con el código del apartado real y "100" con el monto del abono real.
    
  const validateField = (fieldName, value, form) => {
    const errors = {};
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "Estado":
        if (!value || value.trim() === "") {
          fieldErrors.Estado = "El campo Estado es obligatorio";
        }
        break;
      case "Saldo":
        if (isNaN(value)) {
          fieldErrors.Saldo = "El campo Saldo debe ser un número";
        } else if (parseFloat(value) >= parseFloat(form.Total)) {
          fieldErrors.Saldo =
            "El saldo no puede ser igual o mayor que el total";
        }
        break;
      default:
        break;
    }

    return fieldErrors;
  };

  const editar = async (form) => {
    
    console.log("Valores de los campos a editar:", form);
    form.fechaLimite= form.fechaLimite.toString();
    
    console.log("dfghjk",typeof form.fechaLimite);

    try {
      const { Estado, fechaLimite, codigo } = form;
      
      if (!Estado || !fechaLimite) {
        console.error("Estado o fechaLimite no definidos correctamente en el formulario.");
        return;
      }      
      console.log("codigo : ",codigo)
      const apartadoRef = doc(db, "Apartado", codigo);

      console.log("apartadoref",apartadoRef.cedula)
      console.log("apartadoref",apartadoRef.Estado)
      console.log("apartadoref",apartadoRef.Total)

      await updateDoc(apartadoRef, {
        Estado:form.Estado,
        fechaLimite:form.FechaLimite
      });

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 4000);

      console.log("final de update");
      // Asegúrate de tener la función onCreateApartado para actualizar la vista después de la edición
      onCreateApartado();
      closeModalActualizar(); // Asegúrate de cerrar el modal después de la edición
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------Ver--------------------------------------------------------------------
  const [searchOption, setSearchOption] = useState("Nombre");

  const filteredApartados = dataState.filter((apartado) => {
    const searchTerm = searchQuery.toLowerCase();
    if (searchOption === "Nombre") {
      return apartado.NombreCliente.toLowerCase().startsWith(searchTerm);
    } else if (searchOption === "Estado") {
      return (
        apartado.Estado && apartado.Estado.toLowerCase().startsWith(searchTerm)
      );
    } else if (searchOption === "Cédula") {
      return (
        apartado.Cedula && apartado.Cedula.toLowerCase().startsWith(searchTerm)
      );
    }
    // Retorna verdadero para mantener los datos si no coincide con ninguna opción de búsqueda
    return true;
  });

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    if (searchOption === "Cédula") {
      obtenerApartados(1); // Reiniciar los resultados de búsqueda cuando el campo de 'Cédula' cambia
      if (value.trim() !== "") {
        const filteredApartados = dataState.filter((apartado) =>
          apartado.cedula === value.trim()
        );
        setData(filteredApartados);
      }
    }
  };
  
  
  function handleDateChange(date) {
    setSelectedDate(date);
  }
  filteredApartados.map((dato) => <tr key={dato.id}></tr>);

  const handleNextPage = () => {
    // Increment the page and fetch the next page of users
    obtenerApartados(currentPage + 1);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // Decrement the page and fetch the previous page of users
      obtenerApartados(currentPage - 1);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const obtenerApartados = async (page) => {
    try {
      const apartadosPerPage = 10; // Número de apartados para recuperar por página
      const startIndex = (page - 1) * apartadosPerPage;

      const apartadoRef = collection(db, "Apartado");
      const apartadoSnapshot = await getDocs(apartadoRef);
      const allApartados = apartadoSnapshot.docs.map((apartado) =>
        apartado.data()
      );

      // Verifica la estructura de cada documento
      allApartados.forEach((apartado) => {
        console.log("Estado:", apartado.Estado);
        console.log("fechaLimite:", apartado.FechaLimite);
      });

      const slicedApartados = allApartados.slice(
        startIndex,
        startIndex + apartadosPerPage
      );

      setData(slicedApartados); // Actualiza el estado de los datos con los apartados recuperados
    } catch (error) {
      console.error("Error al obtener apartados: ", error);
    }
  };

  const onCreateApartado = () => {
    // Actualizar la lista de apartados llamando a obtenerApartados nuevamente
    obtenerApartados(1);
  };

  //-------------------------------------------------------------------------------------------------------------------------------------------

  //-------------------------------------------------------Eliminar---------------------------------------------------------------------
  const abrirModalEliminar = (codigo) => {
    setTipoAlert("danger");
    setTextoAlert("Apartado eliminado con éxito");
    setUsuario(codigo);
    openModalEliminar();
  };

  const eliminarApartado = async () => {
    try {
      // Eliminar el apartado de Firebase y Firestore
      await deleteDoc(doc(db, "Apartado", usuario.codigo));
      console.log("Apartado eliminado correctamente");

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
      onCreateApartado();
    } catch (error) {
      console.error("Error al eliminar apartado: ", error);
    }
  };

  //------------------------------------------------------------------------------------------------------------------------------------

  //-------------------------------------------------------Detalles--------------------------------------------------------------------------

  const abrirModalListaAbono = (codigo) => {
    console.log("Apartado", codigo);
    setUsuario(codigo);
    openListaAbonoModal();
  };

  const abrirModalProductos = (codigo) => {
    setUsuario(codigo);
    openProductoModal();
  };
  //------------------------------------------------------------------------------------------------------------------------------------------
  return (
    <Container>
      <h1>Apartados</h1>
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
        <option value="Nombre">Nombre</option>
        <option value="cedula">Cédula</option>
        <option value="Estado">Estado</option>
      </select>
      <Table>
        <thead>
          <tr>
            <th>Nombre Cliente</th>
            <th>Cédula</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Fecha Límite</th>
            <th>Saldo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredApartados
            .filter((apartado) =>
              searchOption === "Nombre"
                ? apartado.NombreCliente
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                : apartado.Estado &&
                  apartado.Estado.toLowerCase().includes(
                    searchQuery.toLowerCase()
                  )
            )

            .map((dato) => (
              <tr
                key={dato.id}
                className={dato.Estado == "Moroso" ? "table-danger" : ""}
              >
                <td>{dato.NombreCliente}</td>
                <td>{dato.Cedula}</td>
                <td>{dato.Estado}</td>
                <td>{formatTimestamp(dato.FechaInicio)}</td>
                <td>{formatTimestamp(dato.FechaLimite)}</td>
                <td>{dato.Saldo}</td>

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
                  <Button
                    onClick={() => abrirModalProductos(dato)}
                    color="primary"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                  </Button>
                  <Button
                    onClick={() => abrirModalListaAbono(dato)}
                    color="primary"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} size="lg" />
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
        nombreCrud={"Apartado"}
        Etiquetas={EtiquetasEditar}
      />
      <ModalEliminar
        isOpen={isOpenEliminar}
        closeModal={closeModalEliminar}
        nombre={Apartado.NombreCliente}
        funtionDelete={eliminarApartado}
        nombreCrud={"Apartado"}
      />

      {isOpenListaAbonoModal && (
        <ListaAbonoModal
          isOpenA={isOpenListaAbonoModal}
          closeModal={closeListaAbonoModal}
          abonoData={usuario}
        />
      )}

      {isOpenProductoModal && (
        <ModalDetallesFactura
          isOpenA={isOpenProductoModal}
          closeModal={closeProductoModal}
          elemento={usuario}
          nombreCrud={"Apartado"}
        />
      )}
      {showAlert && (
        <CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />
      )}
    </Container>
  );
}

export default Apartado;
