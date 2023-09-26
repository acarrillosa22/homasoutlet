import React, { useEffect, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import appFirebase from "../../firebase/firebase.js";
import { getFirestore } from "firebase/firestore";
import { Modal, ModalHeader, ModalFooter, Button } from "reactstrap";
import "../modal/modal.css";

function ModalEliminar({ isOpen, closeModal, userIdToDelete, onDeleteUsuario }) {
  const db = getFirestore(appFirebase);

  const cerrarModalEliminar = () => {
    closeModal();
  };

  const eliminarUsuario = async () => {
    try {
      // Eliminar el usuario de Firebase y Firestore
      await deleteDoc(doc(db, "Usuarios", userIdToDelete));
      console.log("Usuario eliminado correctamente");
      onDeleteUsuario();
      closeModal();
      window.alert("Se elimino el Administrador");
    } catch (error) {
      console.error("Error al eliminar usuario: ", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={cerrarModalEliminar}>
      <ModalHeader>
        <div>
          <h3>Eliminar usuario</h3>
        </div>
      </ModalHeader>

      <ModalFooter>
        <Button color="primary" onClick={eliminarUsuario}>
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