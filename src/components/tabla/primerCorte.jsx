import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Container } from "reactstrap";
import { addDoc, collection, getFirestore, updateDoc } from "firebase/firestore";
import appPVH from "../../firebase/firebase";
function PrimerCorte({ isOpenA, closeModal, usuarioC, cajasLista }) {
    const cerrarModal = () => {
        closeModal();
    };
    const [montoMovimiento, setMontoMovimiento] = useState(0);
    const [caja, setCaja] = useState(0);
    const db = getFirestore(appPVH);
    const [habilitar, setHabilitar] = useState(false);
    const crearC = async () => {
        try {
            const docRef = await addDoc(collection(db, "Corte"), {
                Apertura: parseFloat(montoMovimiento),
                Encargado: usuarioC,
                Caja: caja,
                Cierre: 0,
                Fecha: new Date(),
                FechaCierre: new Date(),
                MontoEfectivo: 0,
                MontoSinpe: 0,
                MontoTarjeta: 0,
                Total: 0,
            });
            const corteId = docRef.id;
            await updateDoc(docRef, {Codigo:corteId});
            localStorage.setItem('corteId', corteId.toString()); // Convertir a string
            localStorage.setItem('apertura', parseFloat(montoMovimiento).toString()); // Convertir a string
            localStorage.setItem('cajaUso', caja.toString());
            cerrarModal();
            window.location.href = '/Cierre';
        } catch (error) {
            console.error("Error al crear Corte y documentar en Firestore: ", error);
        }
    };
    const handleMontoMovimientoChange = (event) => {
        setMontoMovimiento(event.target.value);
        if(event > 0 && caja !== 0){
            setHabilitar(true);
        }
        else{
            setHabilitar(false);
        }
            
    };
    const handleCaja = (event) => {
        setCaja(event.target.value);
        if(event !== '' && montoMovimiento > 0){
            setHabilitar(true);
        }
    };
    return (
        <Container>
            <Modal isOpen={isOpenA} toggle={cerrarModal} backdrop="static">
                <ModalHeader>
                    <div>
                        <h3>Caja y dinero de apertura</h3>
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
                    <label>Caja de trabajo</label>
                    <select
                        className="form-control"
                        value={caja}
                        onChange={handleCaja}
                    >
                        <option value="">Selecciona una caja</option>
                        {cajasLista.map((encargado) => (
                            <option key={encargado.Nombre} value={encargado.Nombre}>
                                {encargado.Nombre}
                            </option>
                        ))}
                    </select>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={crearC} disabled={!habilitar}>
                        Empezar
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}

export default PrimerCorte;
