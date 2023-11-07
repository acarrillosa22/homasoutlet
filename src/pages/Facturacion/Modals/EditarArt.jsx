import React, { useState, useEffect } from 'react';
import "./Modals.css";

const EditarArt = ({ isOpen, onClose, datos, onGuardar }) => {
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

    const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    const [cantidadAux, setCantidadAux] = useState(0);
    const [descuentoAux, setDescuentoAux] = useState(0);

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

        // Validar que no se este vendiendo más de lo que hay, se aplique un descuento inválido o se aplique valores negativos
        const validador = newModalData.existencia;
        if ((validador < newModalData.cantidad || newModalData.descuento > 100 || newModalData[index] < 0)) {
            setBotonDeshabilitado(true);
            if (newModalData.descuento > 100) {
                setMensajeError("No se puede guardar debido a que el descuento excede el 100%.");
            }
            else if (newModalData[index] < 0) {
                setMensajeError("No se puede guardar debido a hay valor(es) negativo(s)");
            } 
            else {
                setMensajeError("No se puede guardar debido a la cantidad que se quiere vender es mayor a lo que hay (" + validador + ")");
            }
        } else {
            setBotonDeshabilitado(false);
            setMensajeError('');
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
                {/* Agregar más campos y etiquetas para otros datos aquí */}
                <div>
                    <button onClick={handleGuardar} disabled={botonDeshabilitado}>Guardar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
                {mensajeError && <p className="error-message">{mensajeError}</p>}
            </div>
        </div>
    );
};

export default EditarArt;
