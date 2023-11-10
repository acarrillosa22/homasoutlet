import React, { useState } from 'react';

function ProcesarPago({ isOpen, onClose, datos, onGuardar }) {
    const [modalData, setModalData] = useState({
        abono: undefined,
        estado: 'pagar', // Valor predeterminado
        metodoPago: '',
        total: 0,
        fechaApartado: Date(),
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
    };

    const handleMetodoPagoChange = (e) => {
        const nuevoMetodoPago = e.target.value;
        console.log(nuevoMetodoPago)
        setModalData({
            ...modalData,
            metodoPago: nuevoMetodoPago,
        });
        if(nuevoMetodoPago === ''){
            setProcesarHabilitado(false);
        }
        // Habilitar el botón "Procesar Factura" si se selecciona un método de pago
        else{
            setProcesarHabilitado(true);
        }
        
    };

    const handleFechaApartadoChange = (e) => {
        const fechaApartado = e.target.value;
        setModalData({ ...modalData,
            fechaApartado: fechaApartado});
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
                            onChange={(e) => setModalData({ ...modalData, abono: e.target.value })}
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
                    <button onClick={handleGuardar} disabled={!procesarHabilitado}>
                        Procesar Factura
                    </button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ProcesarPago;
