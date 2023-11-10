import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./modalDetalles.css";

function ModalDetallesPedido({ isOpenA, closeModal, elemento, nombreCrud }) {
  console.log(elemento.Productos)
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
          <h5>Información del producto:</h5>
          <p>Nombre: {elemento.Productos.nombreProducto}</p>
          <p>Cantidad: {elemento.Productos.cantidad}</p>
          <p>Precio: {elemento.Productos.precio}</p>


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

export default ModalDetallesPedido;
