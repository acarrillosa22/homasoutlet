import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import "./modal.css";

function ModalA({
  isOpenA,
  closeModal,
  elemento,
  validateField,
  FuntionEdit,
  fieldOrder,
  nombreCrud,
  Etiquetas,
  additionalParam = "default value",
}) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  useEffect(() => {
    // Reset the form whenever isOpenA changes (modal is opened/closed)
    if (isOpenA ) {
      console.log("aquiii", elemento, form)
      // If modal is opened, populate the form with user data
      setForm(elemento);
    }
  }, [isOpenA, elemento]);

  const resetForm = () => {
    setForm({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    console.log("Campo:", value);
    setForm({
      ...form,
      [name]: value,
    });
    setErrors(validateField(name, value));
  };    

  const handleFechaApartadoChange = (e) => {
    const FechaLimite = e.target.value;
    setForm({ ...form, FechaLimite: FechaLimite });
  };
  const cerrarModalActualizar = () => {
    resetForm();
    closeModal();
  };

  const editar = async () => {
    FuntionEdit(form);
    resetForm();
    closeModal();
  };

  const generateFormGroups = () => {
    return Object.entries(fieldOrder).map(([order, key]) => {
      const label =
        Etiquetas[key] || key.charAt(0).toUpperCase() + key.slice(1);
      if (key === "Estado") {
        // Si es el atributo "rol", generar un combobox
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{label}:</label>
            <select
              className="form-control"
              name={key}
              value={form[key] || ""}
              onChange={(e) => handleChange(e)}
            >
              <option value="Moroso">Moroso</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Pendiente">Pendiente</option>
            </select>
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else if (key === "morosidad") {
        // Si es el atributo "morosidad", generar un checkbox
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{label}:</label>
            <input
              type="checkbox"
              name={key}
              checked={form[key] || false}
              onChange={handleChange}
            />

            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else if (key === "Fecha Limite") {
        // Generar un input para los otros atributos
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{label}:</label>
            <input
              required
              className="form-control"
              type="date"
              name={key}
              value={form[key]}
              onChange={handleFechaApartadoChange}
            />
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else {
        // Generar un input para los otros atributos
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{label}:</label>
            <input
              required
              className="form-control"
              type="text"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            />
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      }
    });
  };

  return (
    <Modal
      className="modalTodo"
      isOpen={isOpenA}
      toggle={cerrarModalActualizar}
      backdrop="static"
    >
      <ModalHeader>
        <div>
          <h3>Editar {nombreCrud}</h3>
        </div>
      </ModalHeader>

      <ModalBody>{generateFormGroups()}</ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={() => editar()}>
          Editar
        </Button>
        <Button color="danger" onClick={cerrarModalActualizar}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalA;