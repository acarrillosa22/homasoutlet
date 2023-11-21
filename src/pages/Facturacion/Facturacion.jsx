import React, { useState, useEffect } from 'react';
import "./Facturacion.css"
import appPVH from '../../firebase/firebase';
import appHOT from '../../firebase/firebaseHOT';
import EditarArt from './Modals/EditarArt';
import ProcesarPago from './Modals/procesarPago';
import { Button, Table } from "reactstrap";
import CustomAlert from "../../components/alert/alert";
import localForage from 'localforage';
//fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc, addDoc } from "firebase/firestore";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft, faEye);
//Aplicar descuento global, asignar cliente (conectar con la base de datos), inactivar factura, modo de pago y estado de factura (modal)
function Factura() {
    const dbPVH = getFirestore(appPVH);
    const dbHOT = getFirestore(appHOT);
    const [showAlert, setShowAlert] = useState(false);
    const [textoAlert, setTextoAlert] = useState("");
    const [tipoAlert, setTipoAlert] = useState("");
    const [departamento, setDepartamento] = useState([]);
    const [producto, setProducto] = useState([]);
    const [cliente, setCliente] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [modalIsOpenArt, setModalIsOpenArt] = useState(false);
    const [modalArt, setModalArt] = useState(null);
    const [descuentoGlobal, setDescuentoGlobal] = useState(0);
    const [modalIsOpenProceso, setModalIsOpenProceso] = useState(false);
    const [modalProceso, setModalProceso] = useState(null);
    const [actualizaTab, setActualizaTab] = useState(true);
    const [isButtonVisible, setButtonVisibility] = useState(false);
    const [nombreCliente, setNombreCliente] = useState("");
    let encontrado = '';
    useEffect(() => { obtenerProducto() }, []);
    useEffect(() => { obtenerCliente() }, []);
    useEffect(() => { obtenerDepartamentos() }, []);
    const [tabs, setTabs] = useState([
        {
            title: 'Factura 1',
            content: {
                productos: [],
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
            productos: [],
            total: 0,
            descuentoGlobal: 0,
            nombreCliente: "",
            abono: 0,
            estado: 0,
            metodo: 0,
        },
    };
    const registroVenta = async () => {
        const updatedTabs = [...tabs];
        const listaProductos = updatedTabs[activeTab].producto;
        listaProductos.forEach(pro => {
            const q = query(collection(dbHOT, "Departamento"), where("Nombre", "==", pro.NombreDepartamento));
            const querySnapshot = getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                encontrado = doc.id;
            });
            if (encontrado !== '') {
                try {
                    const department = doc(dbPVH, "Departamento", encontrado);
                    updateDoc(department, {
                        Ventas: ["nuevo_valor", 1, "12/10/2"]
                    });
                } catch (error) {
                    console.error("Error updating document: ", error);
                }
            }
        });
    };
    const crearFactura = async (form) => {
        try {
            await addDoc(collection(dbPVH, "Factura"), {

            })
        } catch (error) {

        }
    };
    const obtenerCliente = async (page) => {
        try {
            const userRef = collection(dbHOT, "Usuarios");
            const userSnapshot = await getDocs(userRef);
            const allUsers = userSnapshot.docs
                .map((user) => user.data())
                .filter((user) => user.rol === "Cliente");
            setCliente(allUsers);
        } catch (error) {
            console.error("Error al obtener departamentos: ", error);
        }
    };
    const obtenerProducto = async (page) => {
        try {
            const userRef = collection(dbPVH, "Producto");
            const userSnapshot = await getDocs(userRef);
            const allDepartmentos = userSnapshot.docs
                .map((departament) => departament.data())
                .filter((user) => user.Cantidad > 0);
            setProducto(allDepartmentos);
        } catch (error) {
            console.error("Error al obtener departamentos: ", error);
        }
    };
    const obtenerDepartamentos = async (page) => {
        try {
            const userRef = collection(dbPVH, "Departamento");
            const userSnapshot = await getDocs(userRef);
            const allDepartmentos = userSnapshot.docs
                .map((departament) => departament.data())
            setDepartamento(allDepartmentos);
        } catch (error) {
            console.error("Error al obtener departamentos: ", error);
        }
    };
    const [productoAInsertar, setProductoAInsertar] = useState({
        codigoBarras: '',
        descripcion: '',
        precioVenta: 0,
        cantidad: 0,
        importe: 0,
        existencia: 0,
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
        if (updatedTabs.length <= 1) {
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
    //Modal de Pago
    const procesarPago = () => {
        const updatedTabs = [...tabs];
        const activeTabData = {
            abono: updatedTabs[activeTab].content.abono,
            estado: updatedTabs[activeTab].content.estado,
            metodo: updatedTabs[activeTab].content.metodo,
            total: (updatedTabs[activeTab].content.total * (1 - updatedTabs[activeTab].content.descuentoGlobal / 100)),
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

        // En caso de que se este añadiendo otro producto igual
        const activeTabData = updatedTabs[activeTab].content;
        const existingProductIndex = activeTabData.productos.findIndex(
            (producto) => producto.codigoBarras === parseInt(productoAInsertar.codigoBarras)
        );

        if (existingProductIndex !== -1) {
            // Si el producto ya existe, actualiza la cantidad
            if (activeTabData.productos[existingProductIndex].existencia > activeTabData.productos[existingProductIndex].cantidad) {
                activeTabData.productos[existingProductIndex].cantidad++;
            }
        } else {
            // Si el producto no existe, agrégalo a la lista de productos con cantidad 1
            //productos
            producto.forEach((productoBase) => {
                if (productoBase.CodigoBarras === parseInt(productoAInsertar.codigoBarras)) {
                    const newProducto = {
                        codigoBarras: productoBase.CodigoBarras,
                        descripcion: productoBase.Descripcion,
                        precioVenta: productoBase.Precio,
                        cantidad: 1,
                        importe: 0,
                        existencia: productoBase.Cantidad,
                        descuento: 0,
                    };
                    // Actualiza el estado de las pestañas directamente
                    updatedTabs[activeTab].content.productos.push(newProducto);
                }
            });
        }
        // Realiza los cálculos inmediatamente después de insertar
        activeTabData.productos.forEach((producto) => {
            const importe = producto.precioVenta * producto.cantidad * (1 - producto.descuento / 100);
            producto.importe = importe;
        });

        // Calcula el total sumando los importes de todos los productos
        const total = activeTabData.productos.reduce((acc, producto) => acc + producto.importe, 0);
        activeTabData.total = total;

        // Actualiza el estado de las pestañas
        setTabs(updatedTabs);
    };

    const editarNombre = (e) => {
        if (e.key === 'Enter') {
            //Se presiona enter
        }
        else {
            try {
                e.preventDefault();
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
            catch {
                const updatedTabs = [...tabs];
                updatedTabs[activeTab].title = e + " " + updatedTabs[activeTab].title[updatedTabs[activeTab].title.length - 1];
                updatedTabs[activeTab].nombreCliente = e;
                //Hacer algo si el cliente está moroso
                setTabs(updatedTabs);

                setNombreCliente("");
            }
        }
        setActualizaTab(true);
    }

    //Actualiza cambios de modal producto
    const actualizarProducto = (nuevosDatos, index, listaProductos) => {
        const updatedTabs = [...tabs];
        const activeTabData = updatedTabs[activeTab].content;
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
        activeTabData.productos.forEach((producto, productoIndex) => {
            const importe = producto.precioVenta * producto.cantidad * (1 - producto.descuento / 100);
            activeTabData.productos[productoIndex].importe = importe;
        });
        // Calcula el total sumando los importes de todos los productos
        const total = activeTabData.productos.reduce((acc, producto) => acc + producto.importe, 0);
        activeTabData.total = total;
        setTextoAlert("Cambio de productos realizados");
        setTipoAlert("success");
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 4000);
        auxiliar(index);

    }
    // Actualiza cambios modal Pago y envia resultados a la base de datos
    const procesar = (nuevosDatos) => {
        setTextoAlert("factura guardada")
        setTipoAlert("success")

        const updatedTabs = [...tabs];
        const activeTabData = updatedTabs[activeTab].content;
        if (nuevosDatos.abono !== undefined) {
            activeTabData.abono = nuevosDatos.abono;

        }

        activeTabData.fecha = Date();
        activeTabData.metodo = nuevosDatos.metodo;
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 4000);
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
        if (isNaN(descuentoGlobal)) {
            setDescuentoGlobal(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs, activeTab, actualizaTab]);

    useEffect(() => {
        // Al cargar, intenta cargar las facturas desde el almacenamiento local
        localForage.getItem('facturas').then((storedTabs) => {
          if (storedTabs) {
            setTabs(storedTabs);
            if (storedTabs.length <= 1) {
                setButtonVisibility(false);
            }
            else{
                setButtonVisibility(true);
            }
          }
        });
      }, []);

      useEffect(() => {
        // Actualiza el almacenamiento local cada vez que cambia el estado de las facturas
        localForage.setItem('facturas', tabs);
      }, [tabs]);

    const auxiliar = (index) => {
        setActiveTab(index)
        setActualizaTab(true);
    }

    const handleAplicarDescuentoGlobal = (e) => {
        if (e.key === 'Enter') {
            //Se presiona enter
        }
        else {
            e.preventDefault();
        }

        setActualizaTab(true);

        // Copia el estado actual de las pestañas
        const updatedTabs = [...tabs];

        // Obtén el descuento global del estado
        var descuentoGlobalValue = parseFloat(descuentoGlobal);

        // Realiza las validaciones necesarias
        if (isNaN(descuentoGlobalValue)) {
            setDescuentoGlobal(0);
            descuentoGlobalValue = descuentoGlobal;
        }
        if (descuentoGlobal > 100 || descuentoGlobal < 0) {
            setTextoAlert("Valor de descuento invalido");
            setTipoAlert("danger");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 4000);
        } else {
            setTextoAlert("Se aplicó el descuento");
            setTipoAlert("success");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 4000);
        }


        // Aplica el descuento global a la pestaña activa
        updatedTabs[activeTab].content.descuentoGlobal = descuentoGlobalValue;

        // Calcula el importe para cada producto en la pestaña activa
        const activeTabData = updatedTabs[activeTab].content;
        activeTabData.productos.forEach((producto) => {
            const importe = producto.precioVenta * producto.cantidad * (1 - producto.descuento / 100);
            producto.importe = importe;
        });

        // Calcula el total sumando los importes de todos los productos
        const total = activeTabData.productos.reduce((acc, producto) => acc + producto.importe, 0);
        activeTabData.total = total;

        // Actualiza el estado de las pestañas

        setTabs(updatedTabs);
    };

    return (
        <div>
            <ul className="nav">
                {tabs.map((tab, index) => (
                    <li
                        key={index}
                        className={`nav-item ${activeTab === index ? 'active' : ''}`}
                    >
                        <Button
                            className="nav-sublink"
                            onClick={() => auxiliar(index)}
                        >
                            {tab.title}
                        </Button>
                    </li>
                ))}
                <Button
                    onClick={addTab}
                    className={`agregar ${addAnimation ? 'animate' : ''}`}
                >
                    +
                </Button>
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
                    <Button color="success" type="submit">
                        Agregar
                    </Button>
                </form>
                <div className='search-container'>
                    <div className='search-inner'>
                        <input
                            type='text'
                            value={nombreCliente}
                            onChange={(e) => setNombreCliente(e.target.value)}>
                        </input>
                        <Button
                            className="btn btn-success"
                            type="submit"
                            onClick={editarNombre}> Asignar cliente
                        </Button>
                    </div>
                    <div className='dropdown'>
                        {cliente.filter(clien => {
                            const terminoBusco = nombreCliente.toLowerCase();
                            const nombreCompleto = clien.nombre.toLowerCase();
                            return terminoBusco && nombreCompleto.startsWith(terminoBusco);
                        })
                        .slice(0, 5)
                        .map((clien) => (
                            <div
                                onClick={() => editarNombre(clien.nombre)}
                                className='dropdown-row'
                                key={clien.idUser}
                                value={clien.nombre}
                                style={{background: clien.morosidad ? 'red' : 'transparent' }}
                            >{clien.nombre.toLowerCase()}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="discount-options">
                <form onSubmit={handleAplicarDescuentoGlobal}>
                    <input
                        type="number"
                        placeholder="Descuento global"
                        value={descuentoGlobal}
                        onChange={(e) => setDescuentoGlobal(e.target.value)}
                    />
                    <Button
                        color="primary"
                        type="submit"
                    >
                        Aplicar descuento global
                    </Button>
                </form>
            </div>
            <div className="tab-content">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`tab-pane ${activeTab === index ? 'active' : ''}`}
                    >
                        <div className='TablaF'>
                            <Table>
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
                                            <td>₡{(producto.importe).toFixed(0)}</td>
                                            <td>{producto.existencia}</td>
                                            <td className="editarProd">
                                                {" "}
                                                <Button
                                                    onClick={() => handleEditarArt(producto)}
                                                    color="primary"
                                                >
                                                    <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                                                </Button>
                                                <EditarArt
                                                    isOpen={modalIsOpenArt}
                                                    onClose={() => setModalIsOpenArt(false)}
                                                    datos={modalArt}
                                                    onGuardar={(nuevosDatos) => { actualizarProducto(nuevosDatos, index, tab.content.productos) }} />
                                            </td>
                                            <td className="eliminarProductoCont">
                                                <Button
                                                    onClick={() => eliminarFila(index, productoIndex)}
                                                    color="danger"
                                                >
                                                    <FontAwesomeIcon icon={faSquareXmark} size="lg" />
                                                </Button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                        <div className="summary-Bar">
                            <div className="totalCont">
                                Total: ₡{(tab.content.total * (1 - tab.content.descuentoGlobal / 100)).toFixed(0)}
                            </div>
                            <Button className="boton-pago" color="primary" type="submit" onClick={() => procesarPago()}>
                                Procesar pago
                            </Button>
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
                <Button onClick={() => removeTab(activeTab)} color="danger" >
                    Eliminar factura
                </Button>
            )}

            <Button
                onClick={() => clearTableData(activeTab)}
                className="clear-button"
                color="warning"
            >
                Limpiar Factura
            </Button>
            {showAlert && (
                <CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />
            )}
        </div>
    );
}

export default Factura;