import React, { useState, useEffect } from 'react';
import "./Modals.css";

function EditarAbonoDescuento({ isOpen, onClose, datos, onGuardar }) {
    const [modalData, setModalData] = useState([
        //Molde para evitar que se caiga
        {
            abono: undefined,
            descuentoGlobal: undefined,
            total: undefined,
        },
    ]);
    const handleGuardar = () => {
        onGuardar(modalData);
        onClose();
    };

    const [mensajeError, setMensajeError] = useState('');

    useEffect(() => {
        if (isOpen && datos) {
            setModalData(datos);
            if (datos.descuentoGlobal !== 0) {
                setMensajeError('Aplicando el descuento, se obtendrá un total de: ' + datos.total * (1 - datos.descuentoGlobal / 100));
            }
        }
    }, [isOpen, datos]);

    const handleInputChange = (e, index) => {
        // Copiar el estado actual de responseData para no mutarlo directamente
        const newModalData = {
            ...modalData,
            [index]: parseFloat(e.target.value)
        };

        if (isNaN(newModalData.abono)) {
            newModalData.abono = 0;
        }

        if (isNaN(newModalData.descuentoGlobal)) {
            newModalData.descuentoGlobal = 0;
        }

        if (newModalData.descuentoGlobal > 100) {
            setMensajeError("El descuento excede el 100%.");
        }

        else {
            setModalData(newModalData); // Actualizar modalData después de las validaciones
            if (newModalData.descuentoGlobal !== 0) {
                setMensajeError('Aplicando el descuento, se obtendrá un total de: ' + newModalData.total * (1 - newModalData.descuentoGlobal / 100));
            }
            else {
                setMensajeError('');
            }
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
                <h2>Editar Datos</h2>
                <label>Abono:</label>
                <input
                    type="number"
                    value={modalData.abono}
                    onChange={(e) => handleInputChange(e, "abono")}
                />
                <label>Descuento global:</label>
                <input
                    type="number"
                    value={modalData.descuentoGlobal}
                    onChange={(e) => handleInputChange(e, "descuentoGlobal")}
                />
                <div>
                    <button onClick={handleGuardar}>Guardar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
                {mensajeError && <p className="error-message">{mensajeError}</p>}
            </div>
        </div>
    );
};

export default EditarAbonoDescuento;
