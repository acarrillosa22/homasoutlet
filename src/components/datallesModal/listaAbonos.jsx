import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./modalDetalles.css";

function ListaAbonoModal({ isOpenA, closeModal, abonoData }) {
  const cerrarModal = () => {
    closeModal();
  };
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ""; // Maneja el caso en que el timestamp sea undefined
    const date = new Date(timestamp.seconds * 1000);
    return date.toDateString();
  };
console.log(abonoData)
  return (
    <Modal isOpen={isOpenA} toggle={cerrarModal} backdrop="static">
      <ModalHeader>
        <div>
          <h3>Lista de Abonos</h3>
        </div>
      </ModalHeader>

      <ModalBody className="cuerpoModal">
        <div>
          {abonoData.listaAbono &&
            abonoData.listaAbono.map((abono, index) => (
              <div key={index}>
                <p>Fecha: {formatTimestamp(abono.Fecha)}</p>
                <p>Monto: {abono.CantidadAbonada}</p>
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

export default ListaAbonoModal;