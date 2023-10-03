import React, { useEffect, useState } from "react";
import {collection, addDoc } from "firebase/firestore";
import appFirebase from "../../firebase/firebase.js";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../modal/modal.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
} from "reactstrap";

function ModalCrearP({ isOpenA, closeModal, onCreateUsuario }) {
  const [errors, setErrors] = useState({});
  const db = getFirestore(appFirebase);
  const auth = getAuth();
  const initialFormState = {
    nombre: "",
    marca: "",
    codigo:"",
    descripcion: "",
    departamento: "",
    precio: "",
    precioReferencia: "",
    cantidad: "",
    imagen: "",
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
      case "precio":
        fieldErrors.precio =
          isNaN(Number(value))
          ? "El precio debe ser un numero" 
          : "";
        break;
        case "precioReferencia":
        fieldErrors.precioReferencia =
          isNaN(Number(value))
          ? "El precio de referencia debe ser un numero" 
          : "";
        break;
        case "cantidad":
        fieldErrors.cantidad =
          isNaN(Number(value))
          ? "La cantidad debe ser un numero" 
          : "";
        break;
        case "codigo":
        fieldErrors.estado =
          isNaN(Number(value))
          ? "El codigo debe ser un numero" 
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
      const docRef = await addDoc(collection(db, "Producto"), {
        Nombre: form.nombre,
        Id:form.codigo,
        Precio: form.precio,
        Marca:form.marca,
        Cantidad:form.cantidad,
        Estado: 0,
        NombreDepartamento: form.departamento,
        PrecioReferencia: form.precioReferencia,
        Image:form.imagen,
        Descripcion: form.descripcion
      })
  
      console.log("Producto creado y documentado en Firestore");
      closeModal();
      window.alert("Se creo el Producto con exito");
      onCreateUsuario();
    } catch (error) {
      console.error("Error al crear Producto y documentar en Firestore: ", error);
    }
  };

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalCrear} backdrop="static">
      <ModalHeader>
        <div>
          <h3>Crear Producto</h3>
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
        <FormGroup>
          <label>Marca:</label>
          <input
          required 
            className="form-control"
            type="text"
            name="marca"
            value={form.marca}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Descricion:</label>
          <input
          required 
            className="form-control"
            type="text"
            name="descipcion"
            value={form.descripcion}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Departamento:</label>
          <input
          required 
            className="form-control"
            type="text"
            name="departamento"
            value={form.departamento}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup className={errors.cantidad ? "error" : ""}>
          <label>Cantidad:</label>
          <input
          required 
            className="form-control"
            type="int"
            name="cantidad"
            placeholder="solo pueden ser numeros"
            value={form.cantidad}
            onChange={handleChange}
          />
          {errors.cantidad && <div cantidad="error">{errors.cantidad}</div>}
        </FormGroup>
        <FormGroup className={errors.precio ? "error" : ""}>
          <label>Precio:</label>
          <input
          required 
            className="form-control"
            type="int"
            name="precio"
            placeholder="solo pueden ser numeros"
            value={form.precio}
            onChange={handleChange}
          />
          {errors.precio && <div precio="error">{errors.precio}</div>}
        </FormGroup>
        <FormGroup className={errors.precioReferencia ? "error" : ""}>
          <label>Precio de Referencia:</label>
          <input
          required 
            className="form-control"
            type="int"
            name="pReferencia"
            placeholder="solo pueden ser numeros"
            value={form.precioReferencia}
            onChange={handleChange}
          />
          {errors.precioReferencia && <div cantprecioReferenciaidad="error">{errors.precioReferencia}</div>}
        </FormGroup>
        <FormGroup>
          <label>Imagen:</label>
          <input
          required 
            className="form-control"
            name="imagen"
            type="text"
            onChange={handleChange}
            value={form.imagen}
          />
        </FormGroup>
        <FormGroup className={errors.codigo ? "error" : ""}>
          <label>Codigo De Barras:</label>
          <input
          required 
            className="form-control"
            name="codigo"
            type="int"
            onChange={handleChange}
            value={form.codigo}
          />
          {errors.codigo&& <div codigo="error">{errors.codigo}</div>}
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

export default ModalCrearP;