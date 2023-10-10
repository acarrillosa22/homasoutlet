import { doc, deleteDoc } from "firebase/firestore";
import appFirebase from "../../firebase/firebase";
import { getFirestore } from "firebase/firestore";
import { Modal, ModalHeader, ModalFooter, Button,ModalBody } from "reactstrap";
import "../modal/modal.css";
function ModalEliminar({ isOpen, closeModal, nombre,funtionDelete,nombreCrud }) {
  
  const db = getFirestore(appFirebase);

  const cerrarModalEliminar = () => {
    closeModal();
  };
  const eliminarDepartamento = async () => {
    funtionDelete();
    closeModal();
  };
  return (
    <Modal isOpen={isOpen} toggle={cerrarModalEliminar} backdrop="static">
      <ModalHeader>
        <div>
          <h3>Eliminar {nombreCrud}</h3>
        </div>
      </ModalHeader>
      <ModalBody>
    <h4>Realmente desea eliminar el siguiente elemento: {nombre}?</h4>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={eliminarDepartamento}>
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