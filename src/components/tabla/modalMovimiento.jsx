import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Container } from "reactstrap";
import CustomAlert from '../../components/alert/alert';
import { addDoc, collection, getFirestore } from "firebase/firestore";
import appPVH from "../../firebase/firebase";
function ModalMovimiento({ isOpenA, closeModal, corte }) {
    const cerrarModal = () => {
        closeModal();
    };
    const [showAlert, setShowAlert] = useState(false);
    const [textoAlert, setTextoAlert] = useState("");
    const [tipoAlert, setTipoAlert] = useState("");
    const [tipoMovimiento, setTipoMovimiento] = useState("Salida");
    const [montoMovimiento, setMontoMovimiento] = useState(0);
    const [motivoMovimiento, setMotivoMovimiento] = useState("");
    const db = getFirestore(appPVH);
    const crearMovimiento = async () => {
        try {
            await addDoc(collection(db, "Movimiento"), {
                Fecha: new Date(),
                Monto: parseFloat(montoMovimiento),
                Motivo: motivoMovimiento,
                Tipo: tipoMovimiento,
                Corte: corte
            });
            cerrarModal();
            setTextoAlert("Movimiento  realizado con éxito");
            setTipoAlert("success");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 1500);
        } catch (error) {
            console.error("Error al crear producto y documentar en Firestore: ", error);
        }
    };
    const handleTipoMovimientoChange = (event) => {
        setTipoMovimiento(event.target.value);
    };

    const handleMontoMovimientoChange = (event) => {
        setMontoMovimiento(event.target.value);
    };

    const handleMotivoMovimientoChange = (event) => {
        setMotivoMovimiento(event.target.value);
    };
    return (
        <Container>
            <Modal isOpen={isOpenA} toggle={cerrarModal} backdrop="static">
                <ModalHeader>
                    <div>
                        <h3>Movimiento de dinero</h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <select
                        id="tipoMovimiento"
                        value={tipoMovimiento}
                        onChange={handleTipoMovimientoChange}
                    >
                        <option value="Salida">Salida</option>
                        <option value="Entrada">Entrada</option>
                    </select>

                    <label htmlFor="montoMovimiento">Monto</label>
                    <input
                        type="number"
                        id="montoMovimiento"
                        placeholder="Ingrese el monto"
                        value={montoMovimiento}
                        onChange={handleMontoMovimientoChange}
                    />

                    <label htmlFor="motivoMovimiento">Motivo</label>
                    <input
                        type="text"
                        id="motivoMovimiento"
                        placeholder="Ingrese el motivo"
                        value={motivoMovimiento}
                        onChange={handleMotivoMovimientoChange}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={(cerrarModal)}>
                        Cancelar
                    </Button>
                    <Button onClick={crearMovimiento}>
                        Realizar Movimiento
                    </Button>
                </ModalFooter>
            </Modal>
            {showAlert && (<CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />)}
        </Container>
    );
}

export default ModalMovimiento;
