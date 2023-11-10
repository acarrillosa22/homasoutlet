import React, { useState, useEffect } from 'react';
import "./Modals.css";

function EditarArt({ isOpen, onClose, datos, onGuardar }) {
    const [modalData, setModalData] = useState([
        //Molde para evitar que se caiga
        {
            codigoBarras: '',
            descripcion: '',
            precioVenta: 0,
            cantidad: 0,
            importe: 0,
            existencia: 0,
            descuento: 0,
        },
    ]);
    const handleGuardar = () => {
        onGuardar(modalData);
        onClose();
    };
    
    const [mensajeError, setMensajeError] = useState('');
    const [botonActivo, setbotonActivo] = useState(false);

    useEffect(() => {
        if (isOpen && datos) {
            setModalData(datos);
        }
    }, [isOpen, datos]);

    const handleInputChange = (e, index) => {
        // Copiar el estado actual de responseData para no mutarlo directamente
        const newModalData = {
            ...modalData,
            [index]: parseFloat(e.target.value)
        };

        if(isNaN(newModalData.cantidad)){
            newModalData.cantidad = 0;
        }

        if(isNaN(newModalData.descuento)){
            newModalData.descuento = 0;
        }

        // Validar que no se este vendiendo más de lo que hay, se aplique un descuento inválido o se aplique valores negativos
        const validador = newModalData.existencia;
        if (validador < newModalData.cantidad || newModalData.descuento > 100 || newModalData[index] < 0) {
            if (newModalData.descuento > 100) {
                setMensajeError("El descuento excede el 100%.");
            }

            else {
                setMensajeError("La cantidad que se quiere vender es mayor a lo que hay (" + validador + ")");
            }
        } else {
            setbotonActivo(false);
            setMensajeError('');
            if(newModalData.cantidad === 0){
                setbotonActivo(true);
                setMensajeError("No se puede vender 0 prouctos");
            }
            setModalData(newModalData); // Actualizar modalData después de las validaciones
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
                <label>Descuento:</label>
                <input
                    type="number"
                    value={modalData.descuento}
                    onChange={(e) => handleInputChange(e, "descuento")}
                />
                <label>Cantidad:</label>
                <input
                    type="number"
                    value={modalData.cantidad}
                    onChange={(e) => handleInputChange(e, "cantidad")}
                />
                <div>
                    <button onClick={handleGuardar} disabled={botonActivo}>Guardar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
                {mensajeError && <p className="error-message">{mensajeError}</p>}
            </div>
        </div>
    );
};

export default EditarArt;
