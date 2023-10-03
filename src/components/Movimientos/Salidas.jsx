import React, { useState, useEffect } from "react";
import {Modal} from "reactstrap";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import db from "../../firebase/firebase"; // Ajusta la ruta de importación según tu estructura de carpetas
import "./Salidas.css";
import HistorialSalida from "./HistorialSalida";

const Salidas = () => {
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [historial, setHistorial] = useState([]);
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const movimientosRef = collection(db, "Movimiento");

      try {
        const querySnapshot = await getDocs(movimientosRef);
        const historialData = querySnapshot.docs.map((doc) => doc.data());
        setHistorial(historialData);
      } catch (error) {
        console.error("Error al obtener los datos de Firebase: ", error);
      }
    };

    fetchData();
  }, []);

  const handleMontoChange = (event) => {
    const input = event.target.value;
    if (/^\d+(\.\d{0,2})?$/.test(input) || input === "") {
      setMonto(input);
      setErrorMessage("");
    } else {
      setMonto(input);
      setErrorMessage("Por favor, ingresa un monto válido.");
    }
  };

  const handleMotivoChange = (event) => {
    const input = event.target.value;
    setMotivo(input);
    setErrorMessage("");
  };

  const saveRegistro = async () => {
    const db = getFirestore();

    if (!monto || !motivo || !tipo || !fecha) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    const nuevoRegistro = {
      Tipo: tipo,
      Monto: parseFloat(monto),
      Motivo: motivo,
      Fecha: fecha,
    };

    try {
      await addDoc(collection(db, "Movimiento"), nuevoRegistro);
      console.log("Registro guardado en Firebase");
      setHistorial([...historial, nuevoRegistro]);
      setMonto("");
      setMotivo("");
      setTipo("");
      setFecha("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error al guardar el registro en Firebase:", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="container">
      <h1>Movimientos de Dinero</h1>
      <div className="image-container">
        <img src="logo.png" alt="Logo" />
      </div>
      <div className="container-correo">
        <label className="objeto">Tipo de Movimiento</label>
        <input
          placeholder="Ingrese si es entrada o salida ..."
          value={tipo}
          onChange={(event) => setTipo(event.target.value)}
        />
      </div>
      <div className="container-correo">
        <label className="objeto">Fecha</label>
        <input
          placeholder="Ingrese la fecha ej: 23/08/2022 ..."
          value={fecha}
          onChange={(event) => setFecha(event.target.value)}
        />
      </div>
      <div className="container-contraseña">
        <label>Monto</label>
        <input
          placeholder="Ingrese el monto ..."
          value={monto}
          onChange={handleMontoChange}
        />
      </div>
      <div className="container-contraseña">
        <label>Motivo</label>
        <input
          placeholder="Todos los detalles importantes..."
          value={motivo}
          onChange={handleMotivoChange}
          className="objeto"
        />
        <p style={{ color: "red" }}>{errorMessage}</p>
      </div>
      <div>
        <button id="btn-Guardar" onClick={saveRegistro}>
          Guardar
        </button>
        <button id="btn-Historial" onClick={openModal}>
          Historial
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Historial de Salidas"
      >
        <button onClick={closeModal} className="close-button">
          Cerrar
        </button>
        <h2>Historial de Movimientos</h2>
        <HistorialSalida historial={historial} onBackClick={closeModal} />
      </Modal>
    </div>
  );
};

export default Salidas;