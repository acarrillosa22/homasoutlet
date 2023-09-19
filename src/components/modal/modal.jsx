import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button } from "reactstrap";
function ModalA({ isOpenA, closeModal }) {
  const initialFormState = {
    nombre: '',
    telefono: '',
    correo: '',
    rol: ''
  };
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    // Reset the form whenever isOpenA changes (modal is opened/closed)
    if (!isOpenA) {
      resetForm();
    }
  }, [isOpenA]);
  const resetForm = () => {
    setForm(initialFormState);
  };
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const cerrarModalActualizar = () => {
    closeModal();
  };

  const editar = (formData) => {
    // Handle the edit action here using the edited form data
    console.log("Edited form data:", formData);
    // Close the modal after editing
    closeModal();
  };

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalActualizar}>
      <ModalHeader>
        <div>
          <h3>Editar administrador</h3>
        </div>
      </ModalHeader>

      <ModalBody>
        <FormGroup>
          <label>nombre:</label>
          <input
            className="form-control"
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <label>Telefono:</label>
          <input
            className="form-control"
            name="telefono"
            type="tel"
            onChange={handleChange}
            value={form.telefono}
          />
        </FormGroup>

        <FormGroup>
          <label>Correo:</label>
          <input
            className="form-control"
            name="correo"
            type="email"
            onChange={handleChange}
            value={form.correo}
          />
        </FormGroup>
        <FormGroup>
          <label>Rol:</label>
          <input
            className="form-control"
            name="rol"
            type="number"
            onChange={handleChange}
            value={form.rol}
          />
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={() => editar(form)}>
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
