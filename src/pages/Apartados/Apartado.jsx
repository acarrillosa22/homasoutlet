import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalA from "../../components/modal-editar/modal";
import ModalEliminar from "../../components/modal-eliminar/modalEliminar";
import CustomAlert from "../../components/alert/alert";
import ModalDetallesFactura from "../../components/datallesModal/modalDetallesFactura";
import ListaAbonoModal from "../../components/datallesModal/listaAbonos";
import TopNavBar from "../../components/navbarC/navbar";
// Firebase
import { Table, Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import {
  getDoc,
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
// Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faPaste } from "@fortawesome/free-solid-svg-icons";
import { faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle, faCircle } from "@fortawesome/free-regular-svg-icons";

library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft, faEye);

function Apartado() {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toDateString();
  };
  const nombre2 = "Abono";
  const db = getFirestore(appPVH);
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState("");
  const [tipoAlert, setTipoAlert] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cantidadAbonada, setCantidadAbonada] = useState(0);
  const [apartado, setApartado] = useState([]);
  const [abonosPorApartado, setAbonosPorApartado] = useState({});
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] =
    useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] =
    useModal(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dataState, setData] = useState([]);
  const [isOpenListaAbonoModal, openListaAbonoModal, closeListaAbonoModal] =
    useModal(false);
  const [isOpenProductoModal, openProductoModal, closeProductoModal] =
    useModal(false);
  const [isOpenListaAbono, setIsOpenListaAbono] = useState(false);
  const [isOpenProducto, setIsOpenProducto] = useState(false);
  const [usuario, setUsuario] = useState({
    id: "",
    Estado: "",
    FechaLimite: "",
  });

  useEffect(() => {
    obtenerApartados(1);
    const verificarMorosidad = async (codigo, FechaLimite) => {
      try {
        const today = new Date();
        const limite = new Date(FechaLimite);
        if (limite < today) {
          const apartadoRef = doc(db, "Apartado", codigo);
          await updateDoc(apartadoRef, { Estado: "Moroso" });
        }
      } catch (error) {
        console.error("Error al verificar morosidad: ", error);
      }
    };

    if (usuario && usuario.FechaLimite) {
      verificarMorosidad(usuario.id, usuario.FechaLimite);
    }
  }, [usuario]);

  //------------------------------------------------------Editar--------------------------------------------------------------------
  const fieldOrderEditar = {
    1: "Estado",
    2: "Fecha Limite",
  };
  const EtiquetasEditar = {
    FechaLimite: "Fecha Límite",
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
  const seleccionarApartado = (nuevoApartado) => {
    setApartado(nuevoApartado);
    setDocumentoSeleccionado(nuevoApartado.ID);
    setAbonosPorApartado((prevAbonos) => ({
      ...prevAbonos,
      [nuevoApartado.ID]: "",
    }));
  };

  const agregarNuevoAbono = async (cantidadAbonada) => {
    try {
      const abonoRef = doc(db, "Apartado", apartado.ID);
      const listaAbonos = await getDoc(abonoRef);

      if (listaAbonos.exists()) {
        const cantidadNumerica = parseFloat(cantidadAbonada);

        if (
          !isNaN(cantidadNumerica) &&
          cantidadNumerica >= 1 &&
          apartado.Saldo >= cantidadNumerica
        ) {
          // Log antes de la resta
          console.log("Saldo antes de la resta:", apartado.Saldo);

          // Redondea ambos el saldo actual y la cantidad del abono a dos decimales.
          const saldoAntesDeResta = apartado.Saldo;
          const saldoActual = parseFloat(
            (apartado.Saldo - cantidadNumerica).toFixed(2)
          );

          // Log después de la resta
          console.log("Cantidad abonada:", cantidadNumerica);
          console.log("Saldo después de la resta:", saldoActual);

          const listaAbonoData = listaAbonos.data().listaAbono || [];
          const updatedListaAbono = [
            ...listaAbonoData,
            { Fecha: new Date(), CantidadAbonada: cantidadNumerica },
          ];

          await updateDoc(abonoRef, {
            listaAbono: updatedListaAbono,
            Saldo: saldoActual,
          });

          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            // Reinicia la cantidad de abono específica para este apartado en el estado.
            setAbonosPorApartado((prevAbonos) => ({
              ...prevAbonos,
              [apartado.ID]: "",
            }));
          }, 1500);

          // Actualiza el saldo actual en el estado después de cada abono
          setApartado((prevApartado) => ({
            ...prevApartado,
            Saldo: saldoActual,
          }));

          onCreateApartado();
        } else {
          setTextoAlert(
            "Ingrese un número válido mayor o igual a 1 y menor o igual al saldo."
          );
          setTipoAlert("warn");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error al agregar el nuevo abono: ", error);
    }
  };

  const validateField = (fieldName, value, form) => {
    const errors = {};
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "Monto":
        if (isNaN(value) || !/^\d*\.?\d*$/.test(value)) {
          fieldErrors.CantidadAbonada = "El campo debe ser un número";
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
    console.log("FORM AQUÍ", form);

    try {
      const { Estado, FechaLimite, ID } = form;

      if (!Estado || !FechaLimite) {
        console.error(
          "Estado o fechaLimite no definidos correctamente en el formulario."
        );
        return;
      }
      const fechaLimite = new Date(form.FechaLimite);
      const fechaLimiteAjustada = new Date(
        fechaLimite.getTime() + fechaLimite.getTimezoneOffset() * 60000
      );
      console.log("aaaaa", ID);

      const apartadoRef = doc(db, "Apartado", ID);
      console.log("Aqui lo puse X2", form.Estado);
      console.log("Aqui lo puse X2", form.FechaLimite);

      await updateDoc(apartadoRef, {
        Estado: form.Estado,
        FechaLimite: fechaLimiteAjustada,
      });
      console.log("Aqui lo puse", form.Estado);
      console.log("Aqui lo puse", form.FechaLimite);

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
      console.log("final de update");
      onCreateApartado();
      closeModalActualizar();
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
    }

    return true;
  });

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  function handleDateChange(date) {
    setSelectedDate(date);
  }
  filteredApartados.map((dato) => <tr key={dato.id}></tr>);

  const handleNextPage = () => {
    obtenerApartados(currentPage + 1);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      obtenerApartados(currentPage - 1);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const obtenerApartados = async (page) => {
    try {
      const apartadosPerPage = 10;
      const startIndex = (page - 1) * apartadosPerPage;
      const apartadoRef = collection(db, "Apartado");
      const apartadoSnapshot = await getDocs(apartadoRef);
      const allApartados = apartadoSnapshot.docs.map((apartado) =>
        apartado.data()
      );
      const slicedApartados = allApartados.slice(
        startIndex,
        startIndex + apartadosPerPage
      );
      setData(slicedApartados);
    } catch (error) {
      console.error("Error al obtener apartados: ", error);
    }
  };

  const onCreateApartado = () => {
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
      await deleteDoc(doc(db, "Apartado", usuario.ID));
      console.log("Apartado eliminado correctamente");

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
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

  const abrirModalAbono = (apartado) => {
    setTextoAlert("Abono agregado con éxito");
    setTipoAlert("success");
    setApartado(apartado);

    // Inicializa la cantidad de abono para este apartado en 0 si aún no existe en el estado.
    if (!abonosPorApartado[apartado.ID]) {
      setAbonosPorApartado({
        ...abonosPorApartado,
        [apartado.ID]: 0,
      });
    }
    agregarNuevoAbono(abonosPorApartado[apartado.ID]);
  };

  const abrirModalProductos = (codigo) => {
    setUsuario(codigo);
    openProductoModal();
  };

  return (
    <Container>
      <TopNavBar />
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
        <option value="Estado">Estado</option>
      </select>
      <Table>
        <thead>
          <tr>
            <th>Nombre del Cliente</th>
            <th>Cédula</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Fecha Límite</th>
            <th>Saldo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredApartados.map((dato) => (
            <tr
              key={dato.id}
              className={`
      ${dato.Estado === "Moroso" ? "table-danger" : ""}
      ${documentoSeleccionado === dato.ID ? "documento-seleccionado" : ""}
    `}
            >
              <td>{dato.NombreCliente}</td>
              <td>{dato.Cedula}</td>
              <td>{dato.Estado}</td>
              <td>{formatTimestamp(dato.FechaInicio)}</td>
              <td>{formatTimestamp(dato.FechaLimite)}</td>
              <td>{dato.Saldo}</td>

              <td>
                {/* Botón para mostrar el documento seleccionado */}
                {documentoSeleccionado === dato.ID ? (
                  <Button color="warning">
                    <FontAwesomeIcon icon={faCheckCircle} /> 
                  </Button>
                ) : (
                  // Botón para seleccionar el documento
                  <Button
                    onClick={() => seleccionarApartado(dato)}
                    color="warning"
                  >
                    <FontAwesomeIcon icon={faCircle} /> 
                  </Button>
                )}
                <Button
                  onClick={() => abrirModalActualizar(dato)}
                  color="primary"
                >
                  <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                </Button>
                <Button onClick={() => abrirModalEliminar(dato)} color="danger">
                  <FontAwesomeIcon icon={faSquareXmark} size="lg" />
                </Button>
                <Button onClick={() => abrirModalProductos(dato)} color="info">
                  <FontAwesomeIcon icon={faList} size="lg" />
                </Button>
                <Button onClick={() => abrirModalListaAbono(dato)} color="dark">
                  <FontAwesomeIcon icon={faPaste} size="lg" />
                </Button>
                <input
                  type="text"
                  value={abonosPorApartado[dato.ID] || ""}
                  onChange={(e) =>
                    setAbonosPorApartado({
                      ...abonosPorApartado,
                      [dato.ID]: e.target.value,
                    })
                  }
                  placeholder={`₡ Abonar`}
                  className="small-input"
                  style={{ width: "100px" }}
                />

                <Button onClick={() => abrirModalAbono(dato)} color="primary">
                  <FontAwesomeIcon icon={faMoneyCheckDollar} size="lg" />
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
        nombre={apartado.NombreCliente}
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