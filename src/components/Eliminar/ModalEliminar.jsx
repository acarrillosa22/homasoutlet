import React, { useEffect, useState } from "react";
import { doc, deleteDoc, where, collection, getDocs, query } from "firebase/firestore";
import appFirebase from "../../firebase/firebase.js";
import { getFirestore, updateDoc } from "firebase/firestore";
import { Modal, ModalHeader, ModalFooter, Button } from "reactstrap";
import "../modal/modal.css";

function ModalEliminarP({ isOpenD, closeModal,IDProducto,onDeleteProducto }) {
  const db = getFirestore(appFirebase);

  const cerrarModalEliminar = () => {
    closeModal();
  };

  const eliminarUsuario = async () => {
    try {
      
      let encontrado = '';

      const q = query(collection(db, "Producto"), where("Id", "==", IDProducto));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        encontrado =  doc.id;
      });

      await deleteDoc(doc(db, "Producto", encontrado));
      console.log(encontrado);
      console.log("Producto eliminado correctamente");
      onDeleteProducto();
      closeModal();
      window.alert("Se elimino el Producto");
    } catch (error) {
      console.error("Error al eliminar departamento: ", error);
    }
  };

  return (
    <Modal isOpen={isOpenD} toggle={cerrarModalEliminar} backdrop="static">
      <ModalHeader>
        <div>
          <h3>¿Realmente desea eliminar el Producto?</h3>
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

export default ModalEliminarP;