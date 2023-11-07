import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./modalDetalles.css";

function ModalDetalles({ isOpenA, closeModal, elemento, nombreCrud }) {
  console.log(elemento.morosidad)
  const cerrarModal = () => {
    closeModal();
  };

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModal} backdrop="static">
      <ModalHeader>
        <div>
          <h3>Editar {nombreCrud}</h3>
        </div>
      </ModalHeader>

      <ModalBody className="cuerpoModal">
        <div className="column">
          <h5>Información General:</h5>
          <p>Nombre: {elemento.nombre}</p>
          <p>Correo Electrónico: {elemento.correoElectronico}</p>
          <p>Morosidad: {elemento.morosidad ? "Si" : "No"}</p>
          <p>Cédula: {elemento.cedula}</p>
          <p>Teléfono: {elemento.telefono}</p>
          <p>Límite de Crédito: {elemento.limiteDeCredito}</p>

        </div>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={cerrarModal}>
          Aceptar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalDetalles;
