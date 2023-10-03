import React, { useEffect, useState } from "react";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import appFirebase from "../../firebase/firebase.js";
import { getFirestore } from "firebase/firestore";
import { createUserWithEmailAndPasswordcre, getAuth } from "firebase/auth";
import "../modal/modal.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
} from "reactstrap";

function ModalCrear({ isOpenA, closeModal, onCreateUsuario }) {
  const [errors, setErrors] = useState({});
  const db = getFirestore(appFirebase);
  const auth = getAuth();
  const initialFormState = {
    nombre: "",
    estado: "",
    descripcion: "",
  };
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (!isOpenA) {
      resetForm();
    }
  }, [isOpenA]);

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    // Realizar validaciones en tiempo real
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "estado":
        fieldErrors.estado =
          isNaN(Number(value))
          ? "el estado debe ser un numero" 
          : "";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  const cerrarModalCrear = () => {
    closeModal();
  };

  const crearUsuario = async () => {
    try {
      // Agregar información del usuario a Firestore
      const docRef = await addDoc(collection(db, "Departamento"), {
        Nombre: form.nombre,
        Estado: form.estado,
        ID: 1,
        Descripcion: form.descripcion
      })
  
      console.log("Usuario creado y documentado en Firestore");
      closeModal();
      window.alert("Se creo el Administrador con exito");
      onCreateUsuario();
    } catch (error) {
      console.error("Error al crear usuario y documentar en Firestore: ", error);
    }
  };

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalCrear} backdrop="static">
      <ModalHeader>
        <div>
          <h3>Crear Departamentos</h3>
        </div>
      </ModalHeader>

      <ModalBody>
        <FormGroup>
          <label>Nombre:</label>
          <input
          required 
            className="form-control"
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup className={errors.contrasena ? "error" : ""}>
          <label>Estado:</label>
          <input
          required 
            className="form-control"
            type="int"
            name="estado"
            placeholder="solo pueden ser numeros"
            value={form.contrasena}
            onChange={handleChange}
          />
          {errors.contrasena && <div className="error">{errors.contrasena}</div>}
        </FormGroup>
        <FormGroup className={errors.rol ? "error" : ""}>
          <label>Descripción:</label>
          <input
          required 
            className="form-control"
            name="descripcion"
            type="text"
            onChange={handleChange}
            value={form.rol}
          />
          {errors.rol && <div className="error">{errors.rol}</div>}
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={crearUsuario}>
          Crear
        </Button>
        <Button color="danger" onClick={cerrarModalCrear}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalCrear;