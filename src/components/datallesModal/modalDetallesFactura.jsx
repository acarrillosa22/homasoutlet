import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button,Table } from "reactstrap";
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
      <Table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Descuento</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {elemento.Productos.map((dato) => (
            <tr key={dato.Nombre}>
              <td>{dato.Nombre}</td>
              <td>{dato.Cantidad}</td>
              <td>{dato.Descuento}</td>
              <td>{dato.Precio}</td>
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
