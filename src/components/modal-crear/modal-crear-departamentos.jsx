import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
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
      case "cedula":
        fieldErrors.cedula =
          value.length !== 9 || isNaN(Number(value))
            ? "La cédula debe tener 9 caracteres y ser solo números"
            : "";
        break;
      case "contrasena":
        fieldErrors.contrasena =
          value.length < 6 ? "La contraseña debe tener al menos 6 caracteres" : "";
        break;
      case "telefono":
        fieldErrors.telefono =
          value.length !== 8 || isNaN(Number(value))
            ? "El teléfono debe tener 8 números y ser solo números"
            : "";
        break;
      case "rol":
        fieldErrors.rol =
          value !== "Admin" && value !== "Super Admin"
            ? "El rol debe ser 'Admin' o 'Super Admin'"
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
      // Crear usuario en Firebase Authentication
      const userCredential = await (
        auth,
        form.correo,
        form.contrasena
      );
      // Obtener el ID de usuario del usuario creado
      const idDepartamento = userCredential.user.uid;
      console.log(idDepartamento)
      // Agregar información del usuario a Firestore
      await setDoc(doc(db, "Departamento", idDepartamento), {

        idDepartamento: idDepartamento,
        nombre: form.nombre,
        correoElectronico: form.correo,
        contraseña: form.contrasena,
        estado: true,
        morosidad: false,
        cedula: form.cedula,
        rol: form.rol,
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
      closeModal();
      window.alert("Se creo el Administrador con exito");
    } catch (error) {
      console.error("Error al crear usuario y documentar en Firestore: ", error);
    }
  };

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalCrear}>
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