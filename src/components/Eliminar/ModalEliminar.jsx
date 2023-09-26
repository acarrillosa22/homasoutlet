import React, { useEffect, useState } from "react";
import { auth,db } from "../../BaseDatos/fireBaseConet";
import { Modal, ModalHeader, ModalFooter, Button } from "reactstrap";
import "../modal/modal.css";

function ModalEliminar({ isOpen, closeModal, userIdToDelete, onDeleteUsuario }) {
  const cerrarModalEliminar = () => {
    closeModal();
  };
  const [productIdToUpdate, setProductIdToUpdate] = userIdToDelete;

  const eliminarProducto = async () => {
    try {
      // Realiza una actualización en la colección "productos" con el ID especificado
      await db.collection('producto').doc(productIdToUpdate).update({
        Estado: 3, 
      });

      console.log('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={cerrarModalEliminar}>
      <ModalHeader>
        <div>
          <h3>Eliminar producto</h3>
        </div>
      </ModalHeader>

      <ModalFooter>
        <Button color="primary" onClick={eliminarProducto}>
          Eliminar
        </Button>
        <Button color="danger" onClick={cerrarModalEliminar}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalEliminar;