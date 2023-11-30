import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button,Table } from "reactstrap";
import "./modalDetalles.css";

function ModalDetallesFactura({ isOpenA, closeModal, elemento,mostrar }) {
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
      <Table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Descuento</th>
            <th>Precio</th>
            <th>Importe</th>
          </tr>
        </thead>
        <tbody>
          {elemento.Productos.map((dato) => (
            <tr key={dato.Nombre}>
              <td>{dato.Nombre}</td>
              <td>{dato.Cantidad}</td>
              <td>{dato.descuento}</td>
              <td>{dato.Precio}</td>
              <td>{dato.importe}</td>
            </tr>
          ))}
        </tbody>
      </Table>
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
