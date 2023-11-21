import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { uploadImageToStorage } from "../../firebase/firebase";
import CustomAlert from "../alert/alert";
function ModalA({
  isOpenA,
  closeModal,
  elemento,
  validateField,
  FuntionEdit,
  fieldOrder,
  nombreCrud,
  combobox2,
  setImageFile
}) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState("");
  const [tipoAlert, setTipoAlert] = useState("");
  useEffect(() => {
    // Reset the form whenever isOpenA changes (modal is opened/closed)
    if (isOpenA) {
      // If modal is opened, populate the form with user data
      setForm(elemento);
    }
  }, [isOpenA, elemento]);

  const resetForm = () => {
    setForm({});
  };
  const handleChange = async (e) => {
    const { name } = e.target;
    if (name === "Image" || name === "Foto" || name === "Imagen") {
      const imageUrl = await uploadImageToStorage(e.target.files[0], "Imagenes" + nombreCrud);
      setImageFile(imageUrl);
      setTextoAlert("Iamgen guardada");
      setTipoAlert("success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    } else {
      const { value } = e.target;
      setForm({
        ...form,
        [name]: value,
      });
      setErrors(validateField(name, value));
    }
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
      if (key === "rol") {
        // Si es el atributo "rol", generar un combobox
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <select
              className="form-control"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            >
              <option value="">Seleccione un rol</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else if (key === "Estado") {
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <select
              className="form-control"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            >
              <option value="">Seleccione un rol</option>
              <option value="Moroso">Moroso</option>
              <option value="ADia">Al Dia</option>
            </select>
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else if (key === "Morosidad" || key === "morosidad") {
        // Si es el atributo "morosidad", generar un checkbox
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type="checkbox"
              name={key}
              checked={form[key] || false}
              onChange={handleChange}
            />
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else if (key === "correoElectronico" || key === "Correo") {
        return (
          <FormGroup key={key} className={errors ? "error" : ""}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              required
              className="form-control"
              type="email"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            />
            {errors && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else if (key === "Image" || key === "Foto" || key === "Imagen") {
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <input
              type="file"
              name={key}
              accept="image/*"
              value={""}
              onChange={handleChange}
            />
            {showAlert && (<CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />)}
          </FormGroup>
        );
      }
      else if (key === "Departamento") {
        // Si es el atributo "rol", generar un combobox
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <select
              className="form-control"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            >
              <option value="">Selecciona un Departamento</option>
              {combobox2.map((encargado) => (
                <option key={encargado.id} value={encargado.nombre}>
                  {encargado.nombre}
                </option>
              ))}
            </select>
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else {
        // Generar un input para los otros atributos
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
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
    <Modal isOpen={isOpenA} toggle={cerrarModalActualizar} backdrop="static">
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
