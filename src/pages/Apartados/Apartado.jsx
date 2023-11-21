import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalCrear from "../../components/modal-crear/modal-crear-departamentos";
import ModalA from "../../components/modal-editar/modal-editar-departamentos";
import ModalEliminar from "../../components/modal-eliminar/modal-eliminar-departamento";
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
import { faMoneyCheckDollar} from "@fortawesome/free-solid-svg-icons";
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
  const [cantidadAbonada, setCantidadAbonada] = useState();
  const [apartado, setApartado] = useState([]);
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
    fechaLimite: "",
  });

  useEffect(() => {
    obtenerApartados(1);
    const verificarMorosidad = async (codigo, fechaLimite) => {
      try {
        const today = new Date();
        const limite = new Date(fechaLimite);
        if (limite < today) {
          const apartadoRef = doc(db, "Apartado", codigo);
          await updateDoc(apartadoRef, { Estado: "Moroso" });
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
    1: "Estado",
    2: "Fecha Limite",
  };
  const EtiquetasEditar = {
    fechaLimite: "Fecha Límite",
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
  const agregarNuevoAbono = async (cantidadAbonada) => {
    try {
      const abonoRef = doc(db, "Apartado", apartado.ID);
      const listaAbonos = await getDoc(abonoRef);
      console.log(cantidadAbonada);
      if (listaAbonos.exists()) {
        if (apartado.Saldo >= cantidadAbonada && cantidadAbonada >= 1) {
          console.log(apartado.Saldo);
          const saldoActual = apartado.Saldo - parseFloat(cantidadAbonada);
          console.log(saldoActual);
          const listaAbonoData =
            listaAbonos.data().listaAbono || [];
          const updatedListaAbono = [
            ...listaAbonoData,
            { Fecha: new Date(), CantidadAbonada: parseFloat(cantidadAbonada) },
          ];
          await updateDoc(abonoRef, {
            listaAbono: updatedListaAbono,
            Saldo: saldoActual,
          });
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 1500);
          onCreateApartado();
          setCantidadAbonada(0);
        } else {
          setTextoAlert(
            "Abono superior a la cantidad que se debe o el abono es 0"
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
    form.fechaLimite = form.fechaLimite.toString();
    try {
      const { Estado, fechaLimite, codigo } = form;
      if (!Estado || !fechaLimite) {
        console.error(
          "Estado o fechaLimite no definidos correctamente en el formulario."
        );
        return;
      }
      const apartadoRef = doc(db, "Apartado", codigo);
      await updateDoc(apartadoRef, {
        Estado: form.Estado,
        fechaLimite: form.FechaLimite,
      });
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
      return apartado.NombreCliente
        .toLowerCase()
        .startsWith(searchTerm);
    } else if (searchOption === "Estado") {
      return (
        apartado.Estado &&
        apartado.Estado.toLowerCase().startsWith(searchTerm)
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
  const abrirModalAbono = (cedula) => {
    setTextoAlert("Abono agregado con éxito");
    setTipoAlert("success");
    setApartado(cedula);
    agregarNuevoAbono(cantidadAbonada);
  };
  const abrirModalProductos = (codigo) => {
    setUsuario(codigo);
    openProductoModal();
  }
  
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
          {filteredApartados.map((dato) => (
            <tr
              key={dato.id}
              className={dato.Estado === "Moroso" ? "table-danger" : ""}
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
                  color="info"
                >
                  <FontAwesomeIcon icon={faList} size="lg"/>
                </Button>
                <Button
                  onClick={() => abrirModalListaAbono(dato)}
                  color="dark"
                >
                  <FontAwesomeIcon icon={faPaste} size="lg" />
                </Button>
                <input
                  type="number"
                  value={cantidadAbonada}
                  onChange={(e) => setCantidadAbonada(e.target.value)}
                  placeholder="₡ Abonar"
                  className="small-input" style={{ width: '100px' }} 
                />
                <Button
                  onClick={() => abrirModalAbono(dato)}
                  color="primary"
                >
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