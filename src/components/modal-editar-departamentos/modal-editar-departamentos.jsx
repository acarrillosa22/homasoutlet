import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button } from "reactstrap";
function ModalED({ isOpenED, closeModal}) {
    const initialFormState = {
        nombre: '',
        estado: '',
        descripcion: ''
    };

    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
    // Reset the form whenever isOpenA changes (modal is opened/closed)
        if (!isOpenED) {
            resetForm();
        }
    }, [isOpenED]);
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
        <Modal isOpen={isOpenED} toggle={cerrarModalActualizar}>
          <ModalHeader>
            <div>
              <h3>Editar departamentos</h3>
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
                <label>estado:</label>
                <input
                className="form-control"
                type="int"
                name="estado"
                value={form.estado}
                onChange={handleChange} 
                />
            </FormGroup>
    
            <FormGroup>
                <label>descripción:</label>
                <input
                className="form-control"
                type="text"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
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

export default ModalED;