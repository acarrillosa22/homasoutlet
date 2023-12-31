import React, { useEffect, useState } from "react";
import "../modal/modal.css"
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button
} from "reactstrap";
import { uploadImageToStorage } from "../../firebase/firebase";
function ModalCrear({
  isOpenA,
  closeModal,
  validateField,
  FuntionCreate,
  initialForm,
  fieldOrder,
  Combobox,
  nombreCrud,
  combobox2,
  setImageFile,
  Etiquetas
}) {
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isOpenA) {
      resetForm();
    }
  }, [isOpenA]);

  const resetForm = () => {
    setForm(initialForm);
  };
  const handleChange = async(e) => {
    const { name } = e.target;
    if (name === "Image" || name === "Foto" || name === "Imagen") {
      const { value } = e.target;
      setForm({
        ...form,
        [name]: value,
      });
      const imageUrl = await uploadImageToStorage(e.target.files[0], "Imagenes"+nombreCrud);
      setImageFile(imageUrl);
    } else {
      const { value } = e.target;
      setForm({
        ...form,
        [name]: value,
      });
      setErrors(validateField(name, value));
    }
  };

  const cerrarModalCrear = () => {
    closeModal();
  };

  const crear = async () => {
    const formWithImage = { ...form };
    FuntionCreate(formWithImage);
    closeModal();
  };
  const generateFormGroups = () => {
    return Object.entries(fieldOrder).map(([order, key]) => {
      const label =
        Etiquetas[key] || key.charAt(0).toUpperCase() + key.slice(1);
      if (key === "rol") {
        // Si es el atributo "rol", generar un combobox
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{label}:</label>
            <select
              className="form-control"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            >
              <option value="">Seleccione un rol</option>
              {Object.entries(Combobox).map(([roleKey, roleName]) => (
                <option key={roleKey} value={roleKey}>
                  {roleName}
                </option>
              ))}
            </select>
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else if (key === "correoElectronico" || key === "Correo") {
        return (
          <FormGroup key={key} className={errors ? "error" : ""}>
            <label>{label}:</label>
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
      } else if (key === "EstadoD") {
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{label}:</label>
            <select
              className="form-control"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            >
              <option value="">Seleccione un Estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );  
      }
      else if (key === "NombreDepartamento") {
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{label}:</label>
            <select
              className="form-control"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            >
              <option value="">Selecciona un Departamento</option>
              {combobox2.map((encargado) => (
                <option key={encargado.id} value={encargado.Nombre}>
                  {encargado.Nombre}
                </option>
              ))}
            </select>
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else if (key === "Image" || key === "Foto" || key === "Imagen") {
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <input
              type="file"
              name={key}
              accept="image/*"
              value={form[key] || ""}
              onChange={handleChange}
            />
          </FormGroup>
        );
      }
      else {
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
    <Modal isOpen={isOpenA} toggle={cerrarModalCrear} backdrop="static">
      <ModalHeader>
        <div>
          <h3>Crear {nombreCrud}</h3>
        </div>
      </ModalHeader>

      <ModalBody>
        {generateFormGroups()}
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={crear}>
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
