import React, { useState, useEffect } from 'react';
import "./Facturacion.css"
import EditarArt from './Modals/EditarArt';
import EditarAbonoDescuento from './Modals/EditarAbonoDescuento';
import ProcesarPago from './Modals/procesarPago';


//Aplicar descuento global, asignar cliente (conectar con la base de datos), inactivar factura, modo de pago y estado de factura (modal)
function App() {
    const [activeTab, setActiveTab] = useState(0);
    const [modalIsOpenArt, setModalIsOpenArt] = useState(false);
    const [modalArt, setModalArt] = useState(null);
    const [modalIsOpenAD, setModalIsOpenAD] = useState(false);
    const [modalAD, setModalAD] = useState(null);
    const [modalIsOpenProceso, setModalIsOpenProceso] = useState(false);
    const [modalProceso, setModalProceso] = useState(null);
    const [actualizaTab, setActualizaTab] = useState(true);
    const [isButtonVisible, setButtonVisibility] = useState(false);
    const [nombreCliente, setNombreCliente] = useState("");
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
                abono: 0,
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
            abono: 0,
            estado: 0,
            metodo: 0,
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
            abono: 0,
            estado: 0,
            metodo: 0,
        };
        updatedTabs[index].content = { ...defaultContent };
        setTabs(updatedTabs);
    };

    //Modal de producto
    const handleEditarArt = (datos) => {
        setModalArt(datos);
        setModalIsOpenArt(true);
    };

    //Modal de abono
    const handleEditarAD = () => {
        const updatedTabs = [...tabs];
        const activeTabData = {
            abono: updatedTabs[activeTab].content.abono,
            descuentoGlobal: updatedTabs[activeTab].content.descuentoGlobal,
            total: updatedTabs[activeTab].content.total,
        }
        setModalAD(activeTabData);
        setModalIsOpenAD(true);
    };

    //Modal de Pago
    const procesarPago = () => {
        const updatedTabs = [...tabs];
        const activeTabData = {
            abono: updatedTabs[activeTab].content.abono,
            estado: updatedTabs[activeTab].content.estado,
            metodo: updatedTabs[activeTab].content.metodo,
            total: updatedTabs[activeTab].content.total,
        }
        setModalProceso(activeTabData);
        setModalIsOpenProceso(true);
    };

    const agregarProducto = (e) => {
        if (e.key === 'Enter') {
            //Se presiona enter
        }
        else {
            e.preventDefault();
        }
        setActualizaTab(true);

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
        //Se encuentra un código de barras igual en la lista de productos
        if (!hay) {
            updatedTabs[activeTab].content.productos.push(productoAInsertar);
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

    const editarNombre = (e) => {
        if (e.key === 'Enter') {
            //Se presiona enter
        }
        else {
            e.preventDefault();
        }
        setActualizaTab(true);


        // Copia el estado actual de las pestañas
        const updatedTabs = [...tabs];
        if (nombreCliente === "") {
            updatedTabs[activeTab].title = "Factura " + updatedTabs[activeTab].title[updatedTabs[activeTab].title.length - 1];
        }
        else {
            updatedTabs[activeTab].title = nombreCliente + " " + updatedTabs[activeTab].title[updatedTabs[activeTab].title.length - 1];
        }
        updatedTabs[activeTab].nombreCliente = nombreCliente;
        //Hacer algo si el cliente está moroso
        setTabs(updatedTabs);

        setNombreCliente("");
    }

    //Actualiza cambios de modal producto
    const actualizarProducto = (nuevosDatos, index, listaProductos) => {
        var productoE = {
            codigoBarras: '',
            descripcion: '',
            precioVenta: 0,
            cantidad: 0,
            importe: 0,
            existencia: 0,
            descuento: 0,
        };
        for (const producto of listaProductos) {
            if (producto.codigoBarras === nuevosDatos.codigoBarras) {
                productoE = producto;
                break;
            }
        }
        productoE.descuento = nuevosDatos.descuento;
        productoE.cantidad = nuevosDatos.cantidad;
        auxiliar(index);
    }

    //Actualiza cambios de modal Abono descuento global
    const actualizarAD = (nuevosDatos) => {
        const updatedTabs = [...tabs];
        const activeTabData = updatedTabs[activeTab].content;

        activeTabData.descuentoGlobal = nuevosDatos.descuentoGlobal;
        activeTabData.abono = nuevosDatos.abono;
        auxiliar(activeTab);
    }
    // Actualiza cambios modal Pago y envia resultados a la base de datos
    const procesar = (nuevosDatos) => {
        //Salida de los datos
        const updatedTabs = [...tabs];
        const activeTabData = updatedTabs[activeTab].content;
        if(nuevosDatos.abono !== undefined){
            activeTabData.abono = nuevosDatos.abono;
        }
        
        activeTabData.fecha = Date();
        activeTabData.metodo = nuevosDatos.metodo;
        //Manejar salida de datos
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
        activeTabData.total = total;
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
        activeTabData.total = total;

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
                <form onSubmit={editarNombre}>
                    <input
                        type="text"
                        placeholder="Nombre del Cliente"
                        value={nombreCliente}
                        onChange={(e) =>
                            setNombreCliente(e.target.value)
                        }
                    />
                    <button className="nombreCliente" type="submit">Asignar cliente</button>
                </form>
            </div>
            <div className="insert-product">
                <button onClick={() => handleEditarAD()}>Opciones de factura</button>
                <EditarAbonoDescuento
                    isOpen={modalIsOpenAD}
                    onClose={() => setModalIsOpenAD(false)}
                    datos={modalAD}
                    onGuardar={(nuevosDatos) => { actualizarAD(nuevosDatos) }} />
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
                                        <td className='editarProd'><button onClick={() => handleEditarArt(producto)}>Editar</button>
                                            <EditarArt
                                                isOpen={modalIsOpenArt}
                                                onClose={() => setModalIsOpenArt(false)}
                                                datos={modalArt}
                                                onGuardar={(nuevosDatos) => { actualizarProducto(nuevosDatos, index, tab.content.productos) }} />
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
                        <div className="summary-Bar">
                            <div className="totalCont">
                                Total: ₡{tab.content.total * (1 - tab.content.descuentoGlobal / 100)}
                            </div>
                            <div className="abono">
                                Abono: ₡{tab.content.abono}
                            </div>
                            <button className="boton-pago" onClick={() => procesarPago()}>Procesar pago</button>
                            <ProcesarPago
                                isOpen={modalIsOpenProceso}
                                onClose={() => setModalIsOpenProceso(false)}
                                datos={modalProceso}
                                onGuardar={(nuevosDatos) => { procesar(nuevosDatos) }} />
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

export default App;
