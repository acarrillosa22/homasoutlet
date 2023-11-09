import React, { useState, useEffect } from 'react';
import "./Facturacion.css"
import EditarArt from './Modals/EditarArt';

//Aplicar descuento global, asignar cliente (conectar con la base de datos), inactivar factura, modo de pago y estado de factura (modal)
function Factura() {
    const [activeTab, setActiveTab] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [actualizaTab, setActualizaTab] = useState(true);
    const [isButtonVisible, setButtonVisibility] = useState(false);
    const [tabs, setTabs] = useState([
        {
            title: 'Factura 1',
            content: {
                productos: [
                    {
                        codigoBarras: '123456',
                        descripcion: 'Producto 1',
                        precioVenta: 10.00,
                        cantidad: 5,
                        importe: 0,
                        existencia: 20,
                        descuento: 0,
                    },
                    {
                        codigoBarras: '789123',
                        descripcion: 'Producto B',
                        precioVenta: 15.00,
                        cantidad: 3,
                        importe: 0,
                        existencia: 20,
                        descuento: 0,
                    },
                ],
                total: 0,
                descuentoGlobal: 0,
                nombreCliente: "",
            },
        },
    ]);

    const [newContador, setContador] = useState(2);
    const [addAnimation, setAddAnimation] = useState(false);
    //${newContador}`
    // Define la pestaña por defecto
    const defaultTab = {
        title: `Factura ${newContador}`,
        content: {
            productos: [
                {
                    codigoBarras: '123456',
                    descripcion: `Producto ${newContador}`,
                    precioVenta: 10.00,
                    cantidad: 5,
                    importe: 0,
                    existencia: 20,
                    descuento: 0,
                },
                {
                    codigoBarras: '789123',
                    descripcion: 'Producto B',
                    precioVenta: 15.00,
                    cantidad: 3,
                    importe: 0,
                    existencia: 20,
                    descuento: 0,
                },
            ],
            total: 0,
            descuentoGlobal: 0,
            nombreCliente: "",
        },
    };

    const [productoAInsertar, setProductoAInsertar] = useState({
        codigoBarras: '',
        descripcion: 'Producto C',
        precioVenta: 5,
        cantidad: 5,
        importe: 0,
        existencia: 15,
        descuento: 0,
    });

    //Agrega una pestaña
    const addTab = () => {
        const newTabTitle = `Factura ${newContador}`;
        // Clona la pestaña por defecto y actualiza el título
        const newTab = { ...defaultTab, title: newTabTitle };
        const newTabs = [...tabs, newTab];
        setTabs(newTabs);
        setContador(newContador + 1);
        setAddAnimation(true);
        setButtonVisibility(true);
        // Desactiva la animación después de un tiempo
        setTimeout(() => {
            setAddAnimation(false);
        }, 500); // Duración de la animación en milisegundos
    };
    //Inhabilitar: Borrar factura después de 3 años de existencia
    //Elimina la pestaña
    const removeTab = (index) => {
        const updatedTabs = tabs.filter((tab, tabIndex) => tabIndex !== index);
        if (updatedTabs.length === 1) {
            setButtonVisibility(false);
        }
        setTabs(updatedTabs);
        setActiveTab(0);
    };

    //Limpia los datos de la tabla actual
    const clearTableData = (index) => {
        const updatedTabs = [...tabs];
        const defaultContent = {
            productos: [],
            descuentoGlobal: 0,
            total: 0,
            nombreCliente: "",
        };
        updatedTabs[index].content = { ...defaultContent };
        setTabs(updatedTabs);
    };

    //Modal de producto
    const handleEditar = (datos) => {
        setModalData(datos);
        setModalIsOpen(true);
    };

    const agregarProducto = (e) => {
        if (e.key === 'Enter') {
            //Se presiona enter
        }
        else {
            e.preventDefault();
        }
        setActualizaTab(true);

        // Encuentra la pestaña activa
        const activeTabIndex = activeTab;

        // Copia el estado actual de las pestañas
        const updatedTabs = [...tabs];
        var hay = false;
        // En caso de que se este añadiendo otro producto igual
        const activeTabData = updatedTabs[activeTab].content;
        activeTabData.productos.forEach((producto) => {
            if (producto.codigoBarras === productoAInsertar.codigoBarras) {
                if (producto.existencia > producto.cantidad) {
                    producto.cantidad++;
                }
                hay = true;
            }
        });

        // Encuentra la pestaña activa y agrega el producto a la lista de productos
        if (!hay) {
            updatedTabs[activeTabIndex].content.productos.push(productoAInsertar);
        }


        // Actualiza el estado de las pestañas
        setTabs(updatedTabs);

        // Limpia el estado del producto a insertar
        setProductoAInsertar({
            codigoBarras: '',
            descripcion: 'Producto C',
            precioVenta: 5,
            cantidad: 5,
            importe: 0,
            existencia: 15,
            descuento: 0,
        });
    };

    const actualizarProducto = (nuevosDatos, index, producto) => {
        producto.descuento = nuevosDatos.descuento;
        producto.cantidad = nuevosDatos.cantidad;
        auxiliar(index)
    }

    const eliminarFila = (tabIndex, productoIndex) => {
        const updatedTabs = [...tabs];
        updatedTabs[tabIndex].content.productos.splice(productoIndex, 1);
        const activeTabData = updatedTabs[activeTab].content;

        activeTabData.productos.forEach((producto, productoIndex) => {
            const importe = producto.precioVenta * producto.cantidad * (1 - producto.descuento / 100);
            activeTabData.productos[productoIndex].importe = importe;
        });

        // Calcula el total sumando los importes de todos los productos
        const total = activeTabData.productos.reduce((acc, producto) => acc + producto.importe, 0);
        activeTabData.total = total * (1 - activeTabData.descuentoGlobal / 100);
        setTabs(updatedTabs);
    };

    useEffect(() => {
        // Calcula el importe para cada producto en la pestaña activa
        const updatedTabs = [...tabs];
        const activeTabData = updatedTabs[activeTab].content;

        activeTabData.productos.forEach((producto, productoIndex) => {
            const importe = producto.precioVenta * producto.cantidad * (1 - producto.descuento / 100);
            activeTabData.productos[productoIndex].importe = importe;
        });

        // Calcula el total sumando los importes de todos los productos
        const total = activeTabData.productos.reduce((acc, producto) => acc + producto.importe, 0);
        activeTabData.total = total * (1 - activeTabData.descuentoGlobal / 100);

        // Actualiza el estado con los cálculos
        if (actualizaTab === true) {
            setTabs(updatedTabs);
            setActualizaTab(false);
        }
    }, [tabs, activeTab, actualizaTab]);

    const auxiliar = (index) => {
        setActiveTab(index)
        setActualizaTab(true);
    }

    return (
        <div>
            <ul className="nav">
                {tabs.map((tab, index) => (
                    <li
                        key={index}
                        className={`nav-item ${activeTab === index ? 'active' : ''}`}
                    >
                        <button
                            className="nav-sublink"
                            onClick={() => auxiliar(index)}
                        >
                            {tab.title}
                        </button>
                    </li>
                ))}
                <button
                    onClick={addTab}
                    className={`agregar ${addAnimation ? 'animate' : ''}`}
                >
                    +
                </button>
            </ul>
            <div className="insert-product">
                <h2>Insertar Producto</h2>
                <form onSubmit={agregarProducto}>
                    <input
                        type="text"
                        placeholder="Código de Barras"
                        value={productoAInsertar.codigoBarras}
                        onChange={(e) =>
                            setProductoAInsertar({
                                ...productoAInsertar,
                                codigoBarras: e.target.value,
                            })
                        }
                    />
                    <button className="agregarProducto" type="submit">Agregar</button>
                </form>
            </div>
            <div className="tab-content">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`tab-pane ${activeTab === index ? 'active' : ''}`}
                    >
                        <table>
                            <thead>
                                <tr>
                                    <th>Código de Barras</th>
                                    <th>Descripción del Producto</th>
                                    <th>Precio Venta Unidad</th>
                                    <th>Descuento producto</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                    <th>Existencia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tab.content.productos.map((producto, productoIndex) =>
                                    <tr key={productoIndex}>
                                        <td>{producto.codigoBarras}</td>
                                        <td>{producto.descripcion}</td>
                                        <td>₡{producto.precioVenta}</td>
                                        <td>{producto.descuento}%</td>
                                        <td>{producto.cantidad}</td>
                                        <td>₡{producto.importe}</td>
                                        <td>{producto.existencia}</td>
                                        <td className='editarProd'><button onClick={() => handleEditar(producto)}>Editar</button>
                                            <EditarArt
                                                isOpen={modalIsOpen}
                                                onClose={() => setModalIsOpen(false)}
                                                datos={modalData}
                                                onGuardar={(nuevosDatos) => { actualizarProducto(nuevosDatos, index, producto) }} />
                                        </td>
                                        <td className='eliminarProductoCont'>
                                            <button className='eliminarProd' onClick={() => eliminarFila(index, productoIndex)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className='totalCont'>
                            Total: ₡{tab.content.total}
                        </div>
                    </div>
                ))}
            </div>

            {isButtonVisible && (
                <button onClick={() => removeTab(activeTab)} className="remove-button">
                    Eliminar factura
                </button>
            )}

            <button onClick={() => clearTableData(activeTab)} className="clear-button">
                Limpiar Factura
            </button>
        </div>
    );
}

export default Factura;
