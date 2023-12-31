import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Container } from "reactstrap";
import { addDoc, collection, getFirestore, updateDoc } from "firebase/firestore";
import appPVH from "../../firebase/firebase";
function HacerCorte({ isOpenA, closeModal, usuarioC, cajaUso, hacer  }) {
    const cerrarModal = () => {
        closeModal();
    };
    const [montoMovimiento, setMontoMovimiento] = useState(0);
    const db = getFirestore(appPVH);
    const crearC = async () => {
        try {
            hacer();
            const docRef = await addDoc(collection(db, "Corte"), {
                Apertura: parseFloat(montoMovimiento),
                Encargado: usuarioC,
                Caja: cajaUso,
                Cierre: 0,
                Fecha: new Date(),
                FechaCierre: new Date(),
                MontoEfectivo: 0,
                MontoSinpe: 0,
                MontoTarjeta: 0,
                Total: 0,
            });
            const corteId = docRef.id;
            await updateDoc(docRef, { Codigo: corteId });
            localStorage.setItem('corteId', corteId.toString()); // Convertir a string
            localStorage.setItem('apertura', parseFloat(montoMovimiento).toString()); // Convertir a string
            localStorage.setItem('cajaUso', cajaUso.toString());
            cerrarModal();
        } catch (error) {
            console.error("Error al crear Corte y documentar en Firestore: ", error);
        }
    };
    const handleMontoMovimientoChange = (event) => {
        setMontoMovimiento(event.target.value);
    };
    return (
        <Container>
            <Modal isOpen={isOpenA} toggle={cerrarModal} backdrop="static">
                <ModalHeader>
                    <div>
                        <h3>Dinero de apertura de caja</h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <label htmlFor="montoMovimiento">Cantida con la que inicia la caja</label>
                    <input
                        type="number"
                        id="montoMovimiento"
                        placeholder="Ingrese el monto"
                        value={montoMovimiento}
                        onChange={handleMontoMovimientoChange}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={(cerrarModal)}>
                        Cancelar
                    </Button>
                    <Button onClick={crearC}>
                        Empezar
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}

export default HacerCorte;
