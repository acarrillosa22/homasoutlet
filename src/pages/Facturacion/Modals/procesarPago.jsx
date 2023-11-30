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
        efectivo: 0,
    });

    const [procesarHabilitado, setProcesarHabilitado] = useState(false);

    const handleGuardar = () => {
        const fecha = new Date();
        if(modalData.estado === "apartar"){
             // Manejo de fecha apartado-----------
            let actual = fecha.getMonth();
            let fechaApartado = actual + 1;
            fecha.setFullYear(fechaApartado);
            setModalData({
                ...modalData,
                fechaApartado: fecha,
            });   
        }
        onGuardar(modalData);
        onClose();
    };

    const handleEstadoChange = (e) => {
        const nuevoEstado = e.target.value;
        setModalData({
            ...modalData,
            estado: nuevoEstado,
        });
        if (nuevoEstado === 'pendiente') {
            setProcesarHabilitado(true);
        }
        else {
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
            if (modalData.estado === 'apartar' && modalData.abono !== undefined && modalData.abono !== '') {
                setProcesarHabilitado(true);
            }
            else if (modalData.estado === "pagar" && (nuevoMetodoPago === "Tarjeta" || nuevoMetodoPago === "Sinpe")) {
                setProcesarHabilitado(true);
            }
            else{
                setProcesarHabilitado(false);
            }
        }

    };

    const handleDineroChange = (e) => {
        const dinero = e.target.value;
        setModalData({
            ...modalData,
            efectivo: dinero
        });
        if (dinero >= datos.total) {
            setProcesarHabilitado(true);
        }
        else {
            setProcesarHabilitado(false);
        }
    };

    const handleAbonoChange = (e) => {
        const abono = e.target.value;
        setModalData({
            ...modalData,
            abono: abono
        });
        if (abono > 0 && modalData.metodoPago !== '') {
            setProcesarHabilitado(true);
        }
        else{
            setProcesarHabilitado(false);
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
            <div className="modal-content2">
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
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta">Tarjeta</option>
                            <option value="Sinpe">Sinpe</option>
                        </select>
                        {modalData.metodoPago === 'Efectivo' && (
                            <>
                                <label>Efectivo:</label>
                                <input
                                    type="number"
                                    placeholder="Ingrese el monto de pago"
                                    value={modalData.efectivo}
                                    onChange={handleDineroChange}
                                />
                            </>
                        )}
                    </>
                )}
                {modalData.estado === 'apartar' && (
                    <>
                        <label>Método de Abono:</label>
                        <select value={modalData.metodoPago} onChange={handleMetodoPagoChange}>
                            <option value="">Seleccionar Método de Abono</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta">Tarjeta</option>
                            <option value="Sinpe">Sinpe</option>
                        </select>
                        <label>Abono:</label>
                        <input
                            type="number"
                            value={modalData.abono}
                            onChange={handleAbonoChange}
                        />
                    </>
                )}
                <div>
                    <p>Total: {datos.total}</p> {/* Sustituye con el valor correcto */}
                    <Button color="primary" onClick={handleGuardar} disabled={!procesarHabilitado}>
                        Procesar Factura
                    </Button>
                    <Button onClick={onClose} color="danger" className="clear-button">
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProcesarPago;