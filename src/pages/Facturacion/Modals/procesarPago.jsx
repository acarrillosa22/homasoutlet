import React, { useState } from 'react';
import { Button } from "reactstrap";
//fortawesome
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft, faEye);

function ProcesarPago({ isOpen, onClose, datos, onGuardar }) {
    const [modalData, setModalData] = useState({
        abono: undefined,
        estado: 'pagar', // Valor predeterminado
        metodoPago: '',
        total: 0,
        fechaApartado: Date(),
        fechaTemp : Date(),
    });

    const [procesarHabilitado, setProcesarHabilitado] = useState(false);

    const handleGuardar = () => {
        onGuardar(modalData);
        onClose();
    };

    const handleEstadoChange = (e) => {
        const nuevoEstado = e.target.value;
        setModalData({
            ...modalData,
            estado: nuevoEstado,
            metodoPago: '', // Restablecer el método de pago al cambiar el estado
        });
        if (nuevoEstado === 'pendiente') {
            setProcesarHabilitado(true);
        }
        else{
            setProcesarHabilitado(false);
        }
    };

    const handleMetodoPagoChange = (e) => {
        const nuevoMetodoPago = e.target.value;
        setModalData({
            ...modalData,
            metodoPago: nuevoMetodoPago,
        });
        if (nuevoMetodoPago === '') {
            setProcesarHabilitado(false);
        }
        // Habilitar el botón "Procesar Factura" si se selecciona un método de pago
        else {
            if(modalData.estado === 'apartar' &&  modalData.abono !== undefined && modalData.fechaTemp !== modalData.fechaApartado){
                setProcesarHabilitado(true);
            }
            if(modalData.estado === 'pagar'){
                setProcesarHabilitado(true);
            }
        }

    };

    const handleFechaApartadoChange = (e) => {
        const fechaApartado = e.target.value;
        setModalData({
            ...modalData,
            fechaApartado: fechaApartado
        });
        console.log(modalData.abono !== 0)
        if(modalData.abono !== undefined){
            setProcesarHabilitado(true);
        }
    };

    const handleAbonoChange = (e) => {
        const abono = e.target.value;
        setModalData({
            ...modalData,
            abono: abono
        });
        if(modalData.fechaTemp !== modalData.fechaApartado){
            setProcesarHabilitado(true);
        }
    };

    const modalStyle = {
        display: isOpen ? 'block' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '105%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 999,
        marginTop: '25%',
        marginLeft: '50%',
    };

    if (!isOpen || !datos) {
        return null;
    }

    return (
        <div className={modalStyle}>
            <div className="modal-content">
                <h2>Procesar Pago</h2>
                <label>Estado:</label>
                <select value={modalData.estado} onChange={handleEstadoChange}>
                    <option value="pagar">Pagar</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="apartar">Apartar</option>
                </select>
                {modalData.estado === 'pagar' && (
                    <>
                        <label>Método de Pago:</label>
                        <select value={modalData.metodoPago} onChange={handleMetodoPagoChange}>
                            <option value="">Seleccionar Método de Pago</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="sinpe">Sinpe</option>
                        </select>
                    </>
                )}
                {modalData.estado === 'apartar' && (
                    <>
                        <label>Método de Abono:</label>
                        <select value={modalData.metodoPago} onChange={handleMetodoPagoChange}>
                            <option value="">Seleccionar Método de Abono</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="sinpe">Sinpe</option>
                        </select>
                        <label>Abono:</label>
                        <input
                            type="number"
                            value={modalData.abono}
                            onChange={handleAbonoChange}
                        />
                        <label>Fecha limite de apartado:</label>
                        <input
                            type="date"
                            placeholder="Fecha de duración del apartado"
                            value={modalData.fechaApartado}
                            onChange={handleFechaApartadoChange}
                        />
                    </>
                )}
                <div>
                    <p>Total: {datos.total}</p> {/* Sustituye con el valor correcto */}
                    <Button color="primary" onClick={handleGuardar} disabled={!procesarHabilitado}>
                        Procesar Factura
                    </Button>
                    <Button onClick={onClose} color="danger">
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProcesarPago;