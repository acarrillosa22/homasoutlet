import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./modalDetalles.css";

function ModalDetallesFactura({ isOpenA, closeModal, elemento,mostrar }) {
  console.log(elemento.Producto);
  const cerrarModal = () => {
    closeModal();
  };

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModal} backdrop="static">
      <ModalHeader>
        <div>
          <h3>Productos</h3>
        </div>
      </ModalHeader>

      <ModalBody className="cuerpoModal">
        <div>
          {elemento.Productos.map((producto, index) => (
            <div key={index}>
              <p>Nombre: {producto.Nombre}</p>
              <p>Cantidad: {producto.Cantidad}</p>
              {mostrar && producto.Descuento && (
                <div>
                  <p>Descuento: {producto.Descuento}</p>
                </div>
              )}
              <p>Precio: {producto.Precio}</p>
              <hr />
            </div>
          ))}
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

export default ModalDetallesFactura;
