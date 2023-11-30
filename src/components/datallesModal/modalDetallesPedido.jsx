import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button,Table } from "reactstrap";
import "./modalDetalles.css";

function ModalDetallesPedido({ isOpenA, closeModal, elemento,mostrar }) {
  console.log(elemento.productos);
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
            <th>Nombre del Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {elemento.productos.map((dato) => (
            <tr key={dato.idProducto}>
              <td>{dato.nombreProducto}</td>
              <td>{dato.cantidad}</td>
              <td>{dato.precio}</td>
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

export default ModalDetallesPedido;
