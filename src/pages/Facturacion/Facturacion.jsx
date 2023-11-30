import React, { useState, useEffect } from 'react';
import "./Facturacion.css"
import appPVH from '../../firebase/firebase';
import appHOT from '../../firebase/firebaseHOT';
import EditarArt from './Modals/EditarArt';
import ProcesarPago from './Modals/procesarPago';
import { Button, Container, Table } from "reactstrap";
import CustomAlert from "../../components/alert/alert";
import localForage from 'localforage';
import { format } from "date-fns";
//fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc, addDoc } from "firebase/firestore";
import TopNavBar from '../../components/navbarC/navbar';
import jsPDF from 'jspdf';
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
    const [usuarioC, setUsuarioC] = useState([]);
    const [corte, setCorte] = useState([]);
    useEffect(() => { obtenerProducto() }, []);
    useEffect(() => { obtenerCliente() }, []);
    useEffect(() => { obtenerDepartamentos() }, []);
    const encab = {
        CorreoSede: "HOMASOUTLET@GMAIL.COM",
        Dueño: { Nombre: "MASIEL RODRIGUEZ", Cedula: 208260235 },
        NombreE: "HOMAS OUTLET", Telefono: 60998945
    }
    const mifactura = {
        Corte: corte,
        Total: 0,
        Cliente: '',
        Cedula:  '',
        Cajero: '',
        Descuento: 0,
        FechaExpira: null,
        Fecha: null,
        Productos: {},
        TipoPago: '',
        pagoCliente: '',
        vuelvoCliente: 0,
        Encabezado: encab,
    }
    const [tabs, setTabs] = useState([
        {
            title: 'Factura 1',
            content: {
                productos: [],
                total: 0,
                descuentoGlobal: 0,
                nombreCliente: "",
                abono: 0,
                clienteB: {},
                botonGlobal: false,
            },
        },
    ]);
    const [newContador, setContador] = useState(() => {
        const storedCounter = localStorage.getItem('contadorFactura');
        return storedCounter ? parseInt(storedCounter, 10) : 1;
    });
    const [addAnimation, setAddAnimation] = useState(false);
    const [procesando, setProcesando] = useState(false);
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
            clienteB: {},
            botonGlobal: false,
        },
    };
    const registroVenta = async (data) => {
        const listaProductos = data;
        const departamentosActualizados = new Set();

        // Iterar sobre cada departamento
        for (const dep of departamento) {
            let found = false;
            // Iterar sobre cada producto en la lista
            for (const element of listaProductos) {
                if (dep.Nombre === element.departamento) {
                    const total = element.importe;
                    // Verificar si hay ventas previas durante el mismo corte
                    if (dep.Ventas.length > 0) {
                        const ultimaVenta = dep.Ventas[dep.Ventas.length - 1];

                        if (ultimaVenta.Corte === corte) {
                            // Actualizar la venta existente durante el mismo corte
                            ultimaVenta.Monto += total;
                            found = true;
                        }
                    }
                    // Si no se encontró una venta durante el mismo corte, agregar una nueva
                    if (!found) {
                        dep.Ventas.push({
                            Fecha: new Date(),
                            Monto: total,
                            Corte: corte,
                        });
                    }
                    // Agregar el departamento a la lista de departamentos actualizados
                    departamentosActualizados.add(dep);
                }
            }
        }

        try {
            // Iterar sobre cada departamento actualizado y actualizar en Firestore
            const departamentosRef = collection(dbPVH, "Departamento");

            for (const dep of departamentosActualizados) {
                const q = query(departamentosRef, where("Nombre", "==", dep.Nombre));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach(async (d) => {
                    const departamentoRef = doc(dbPVH, "Departamento", d.id);
                    await updateDoc(departamentoRef, {
                        Ventas: dep.Ventas,
                        // Aquí puedes agregar otras propiedades que necesites actualizar
                    });
                });
            }
            console.log("Cambios en departamentos subidos con éxito");
        } catch (error) {
            console.error("Error al subir cambios en departamentos: ", error);
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
    const obtenerProducto = async () => {
        try {
            const userRef = collection(dbPVH, "Producto");
            const userSnapshot = await getDocs(userRef);
            const allDepartmentos = userSnapshot.docs
                .map((departament) => departament.data())
                .filter((user) => user.Cantidad > 0 && user.Estado !== 1);
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
        Precio: 0,
        Cantidad: 0,
        importe: 0,
        existencia: 0,
        descuento: 0,
        Nombre: '',
        costo: 0,
        vT: 0,
    });

    //Agrega una pestaña
    const addTab = () => {
        // Restablece el contador cada vez que se inicia un nuevo día
        const storedDate = localStorage.getItem('lastVisitedDate');
        const currentDate = new Date().toLocaleDateString();
        if (storedDate !== currentDate) {
            setContador(1);
            localStorage.setItem('lastVisitedDate', currentDate);
        }
        else {
            setContador(newContador + 1);
        }

        const newTabTitle = `Factura ${newContador}`;
        // Clona la pestaña por defecto y actualiza el título
        const newTab = { ...defaultTab, title: newTabTitle };
        const newTabs = [...tabs, newTab];
        setTabs(newTabs);
        setAddAnimation(true);
        setButtonVisibility(true);
        // Desactiva la animación después de un tiempo
        setTimeout(() => {
            setAddAnimation(false);
        }, 500); // Duración de la animación en milisegundos

        auxiliar(newTabs.length - 1);
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
            clienteB: {},
            botonGlobal: false,
        };
        updatedTabs[index].content = { ...defaultContent };

        if (!procesando) {//No se procesa pago
            const match = updatedTabs[activeTab].title.match(/\d+$/); // Buscar el número al final
            const numero = match ? match[0] : ''; // Obtener el número si se encuentra
            updatedTabs[activeTab].title = "Factura " + numero;
        }
        else {
            setContador(newContador + 1);
            const newTabTitle = `Factura ${newContador}`;
            updatedTabs[activeTab].title = newTabTitle;
            setProcesando(false);
        }
        setTabs(updatedTabs);
    };

    //Modal de producto
    const handleEditarArt = (datos) => {
        const global = tabs[activeTab].content.descuentoGlobal;
        datos.global = global;
        setModalArt(datos, global);
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
        let existente = false;
        // Copia el estado actual de las pestañas
        const updatedTabs = [...tabs];

        // En caso de que se este añadiendo otro producto igual
        const activeTabData = updatedTabs[activeTab].content;
        const existingProductIndex = activeTabData.productos.findIndex(
            (producto) => producto.codigoBarras === parseInt(productoAInsertar.codigoBarras)
        );

        if (existingProductIndex !== -1) {
            // Si el producto ya existe, actualiza la cantidad
            if (activeTabData.productos[existingProductIndex].existencia > activeTabData.productos[existingProductIndex].Cantidad) {
                activeTabData.productos[existingProductIndex].Cantidad++;
                existente = true;
            }
        } else {
            // Si el producto no existe, agrégalo a la lista de productos con cantidad 1
            //productos
            producto.forEach((productoBase) => {
                if (productoBase.CodigoBarras === parseInt(productoAInsertar.codigoBarras)) {
                    const newProducto = {
                        codigoBarras: productoBase.CodigoBarras,
                        descripcion: productoBase.Descripcion,
                        Precio: productoBase.Precio,
                        departamento: productoBase.NombreDepartamento,
                        Cantidad: 1,
                        importe: 0,
                        costo: productoBase.PrecioReferencia,
                        vT: productoBase.CantidaVendidos,
                        existencia: productoBase.Cantidad,
                        descuento: 0,
                        Nombre: productoBase.Nombre
                    };
                    existente = true;
                    // Actualiza el estado de las pestañas directamente
                    updatedTabs[activeTab].content.productos.push(newProducto);
                }
            });
        }
        // Realiza los cálculos inmediatamente después de insertar
        activeTabData.productos.forEach((producto) => {
            const importe = producto.Precio * producto.Cantidad * (1 - producto.descuento / 100);
            producto.importe = importe;

        });

        // Calcula el total sumando los importes de todos los productos
        const total = activeTabData.productos.reduce((acc, producto) => acc + producto.importe, 0);
        activeTabData.total = total;

        // Actualiza el estado de las pestañas
        if (existente) {
            setTabs(updatedTabs);
            setTextoAlert("Producto agregado");
            setTipoAlert("success");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 1500);
        }
        else {
            setTabs(updatedTabs);
            setTextoAlert("Producto no encontrado");
            setTipoAlert("warning");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 1500);
        }
    };

    const editarNombre = (e, x) => {
        if (e.key === 'Enter') {
            //Se presiona enter
        }
        else {
            try {
                e.preventDefault();
                // Copia el estado actual de las pestañas
                const updatedTabs = [...tabs];
                const match = updatedTabs[activeTab].title.match(/\d+$/); // Buscar el número al final
                const numero = match ? match[0] : ''; // Obtener el número si se encuentra
                if (nombreCliente === "") {
                    updatedTabs[activeTab].title = "Factura " + numero;
                }
                else {
                    updatedTabs[activeTab].title = nombreCliente + " " + numero;
                }
                updatedTabs[activeTab].nombreCliente = nombreCliente;
                updatedTabs[activeTab].content.clienteB = { e, x };
                setTabs(updatedTabs);
                setNombreCliente("");
            }
            catch {
                const updatedTabs = [...tabs];
                const match = updatedTabs[activeTab].title.match(/\d+$/); // Buscar el número al final
                const numero = match ? match[0] : ''; // Obtener el número si se encuentra
                updatedTabs[activeTab].title = e + " " + numero;
                updatedTabs[activeTab].nombreCliente = e;
                updatedTabs[activeTab].content.clienteB = { e, x };
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
            Precio: 0,
            Cantidad: 0,
            importe: 0,
            existencia: 0,
            descuento: 0,
            Nombre: '',
            costo: 0,
            vT: 0,
        };
        for (const producto of listaProductos) {
            if (producto.codigoBarras === nuevosDatos.codigoBarras) {
                productoE = producto;
                break;
            }
        }
        productoE.descuento = nuevosDatos.descuento;
        productoE.Cantidad = nuevosDatos.Cantidad;
        let descuentoA = false;
        activeTabData.productos.forEach((producto, productoIndex) => {
            const importe = producto.Precio * producto.Cantidad * (1 - producto.descuento / 100);
            activeTabData.productos[productoIndex].importe = importe;
            if (!descuentoA) {
                if (producto.descuento !== 0 || producto.descuento !== "") {
                    activeTabData.botonGlobal = true;
                    descuentoA = true;
                }
                else {
                    activeTabData.botonGlobal = false;
                }
            }
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
    const procesar = async (nuevosDatos) => {
        let errores = true;
        const updatedTabs = [...tabs];
        const activeTabData = updatedTabs[activeTab];
        if (nuevosDatos.abono !== undefined) {
            activeTabData.abono = nuevosDatos.abono;
        }

        const fecha1 = new Date();
        const fecha2 = new Date();
        activeTabData.fecha = fecha1;
        activeTabData.metodo = nuevosDatos.metodoPago;
        activeTabData.estado = nuevosDatos.estado;
        activeTabData.cajero = usuarioC.nombre;
        activeTabData.corte = corte;
        activeTabData.efectivo = parseFloat(nuevosDatos.efectivo);
        // Manejo de fecha expirar-----------
        let actual = fecha2.getFullYear();
        let fechaExpirar = actual + 3;
        fecha2.setFullYear(fechaExpirar);
        activeTabData.fechaExpirar = fecha2;
        mifactura.Corte= corte;
        mifactura.Total= parseFloat((activeTabData.content.total * (1 - activeTabData.content.descuentoGlobal / 100)).toFixed(0));
        mifactura.Cliente= activeTabData.content.clienteB.e ?? '';
        mifactura.Cedula=  activeTabData.content.clienteB.x ?? '';
        mifactura.Cajero= usuarioC.nombre;
        mifactura.Descuento= activeTabData.content.descuentoGlobal;
        mifactura.FechaExpira= activeTabData.fechaExpirar;
        mifactura.Fecha= activeTabData.fecha;
        mifactura.Productos= activeTabData.content.productos;
        mifactura.TipoPago= activeTabData.metodo;
        
        
        //----------------------------------
        if (activeTabData.metodo === "Efectivo" && activeTabData.estado === "pagar" && nuevosDatos.efectivo >= parseFloat((activeTabData.content.total * (1 - activeTabData.content.descuentoGlobal / 100)).toFixed(0))) {
            setTextoAlert("Su vuelto es: " + (parseFloat(activeTabData.efectivo) - parseFloat((activeTabData.content.total * (1 - activeTabData.content.descuentoGlobal / 100)).toFixed(0))));
            setTipoAlert("primary");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 4000);

            try {
                await addDoc(collection(dbPVH, "Factura"), {
                    Corte: corte,
                    Total: parseFloat((activeTabData.content.total * (1 - activeTabData.content.descuentoGlobal / 100)).toFixed(0)),
                    Cliente: activeTabData.content.clienteB.e ?? '',
                    Cedula: activeTabData.content.clienteB.x ?? '',
                    Cajero: usuarioC.nombre,
                    Descuento: activeTabData.content.descuentoGlobal,
                    FechaExpira: activeTabData.fechaExpirar,
                    Fecha: activeTabData.fecha,
                    Productos: activeTabData.content.productos,
                    TipoPago: activeTabData.metodo,
                    pagoCliente: parseFloat(activeTabData.efectivo),
                    vuelvoCliente: parseFloat(activeTabData.efectivo - activeTabData.content.total),
                    Encabezado: encab,
                })
                mifactura.pagoCliente= parseFloat(activeTabData.efectivo);
                mifactura.vuelvoCliente= parseFloat(activeTabData.efectivo - activeTabData.content.total);
                proA(activeTabData)
                errores = false
            } catch (error) {
                errores = true
                console.error("Error al crear Factura y documentar en Firestore: ", error);
            }
        }
        else if (activeTabData.estado === "pagar" && (activeTabData.metodo === "Sinpe" || activeTabData.metodo === "Tarjeta")) {
            setTextoAlert("Factura guardada");
            setTipoAlert("primary");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 4000);
            try {
                await addDoc(collection(dbPVH, "Factura"), {
                    Corte: corte,
                    Cliente: activeTabData.content.clienteB.e ?? '',
                    Cedula: activeTabData.content.clienteB.x ?? '',
                    Total: parseFloat((activeTabData.content.total * (1 - activeTabData.content.descuentoGlobal / 100)).toFixed(0)),
                    Cajero: usuarioC.nombre,
                    Descuento: activeTabData.content.descuentoGlobal,
                    FechaExpira: activeTabData.fechaExpirar,
                    Fecha: activeTabData.fecha,
                    Productos: activeTabData.content.productos,
                    TipoPago: activeTabData.metodo,
                    pagoCliente: parseFloat(activeTabData.content.total),
                    vuelvoCliente: 0,
                    Encabezado: encab,
                })
                mifactura.pagoCliente= parseFloat(activeTabData.content.total);
                proA(activeTabData)
                errores = false
            } catch (error) {
                errores = true
                console.error("Error al crear Factura y documentar en Firestore: ", error);
            }
        }
        else if (activeTabData.estado === "pendiente") {
            setTextoAlert("Factura guardada");
            setTipoAlert("primary");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 4000);
            try {
                await addDoc(collection(dbPVH, "Factura"), {
                    Corte: corte,
                    Total: parseFloat((activeTabData.content.total * (1 - activeTabData.content.descuentoGlobal / 100)).toFixed(0)),
                    Cajero: usuarioC.nombre,
                    Cliente: activeTabData.content.clienteB.e ?? '',
                    Cedula: activeTabData.content.clienteB.x ?? '',
                    Descuento: activeTabData.descuentoGlobal,
                    FechaExpira: activeTabData.fechaExpirar,
                    Fecha: activeTabData.fecha,
                    Productos: activeTabData.content.productos,
                    TipoPago: "",
                    pagoCliente: 0,
                    vuelvoCliente: 0,
                    Encabezado: encab,
                })
                mifactura.pagoCliente= parseFloat(activeTabData.content.total);
                proA(activeTabData)
                errores = false
            } catch (error) {
                errores = true
                console.error("Error al crear Factura y documentar en Firestore: ", error);
            }
        }
        else if (activeTabData.estado === "apartar" && Object.keys(activeTabData.content.clienteB).length > 0) {
            activeTabData.abono = nuevosDatos.abono;
            if (activeTabData.abono > 0) {
                try {
                    const docRef = await addDoc(collection(dbPVH, "Apartado"), {
                        Corte: corte,
                        NombreCliente: activeTabData.content.clienteB.e,
                        Cedula: activeTabData.content.clienteB.x,
                        Total: parseFloat((activeTabData.content.total * (1 - activeTabData.content.descuentoGlobal / 100)).toFixed(0)),
                        listaAbono: [{ Fecha: activeTabData.fecha, CantidadAbonada: parseFloat(activeTabData.abono) }],
                        Cajero: usuarioC.nombre,
                        FechaLimite: activeTabData.fechaExpirar,
                        FechaInicio: activeTabData.fecha,
                        Productos: activeTabData.content.productos,
                        Saldo: parseFloat((activeTabData.content.total * (1 - activeTabData.content.descuentoGlobal / 100)).toFixed(0) - parseFloat(activeTabData.content.abono)),
                        Estado: "Activo"
                    })
                    const apartadoId = docRef.id;
                    await updateDoc(docRef, { ID: apartadoId });
                    proA(activeTabData)
                    errores = false
                } catch (error) {
                    errores = true
                    console.error("Error al crear Apartado y documentar en Firestore: ", error);
                }
            } else {
                errores = true
                setTextoAlert("No se permiten apartados sin un abono");
                setTipoAlert("danger");
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 4000);
            }
        }
        else {
            setTextoAlert("Verifique la información");
            setTipoAlert("danger");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 4000);
            errores = true
        }
        //Guardar resto
        if (errores) {
            console.log("Problemas");
        } else {
            if (updatedTabs.length > 1) {
                removeTab(activeTab);
            } else {
                setProcesando(true);
                clearTableData(activeTab);
            }
            registroVenta(mifactura.Productos);
            obtenerProducto();
            generarPDF(mifactura);
        }
    }

    const eliminarFila = (tabIndex, productoIndex) => {
        const updatedTabs = [...tabs];
        updatedTabs[tabIndex].content.productos.splice(productoIndex, 1);
        const activeTabData = updatedTabs[activeTab].content;
        let descuentoA = false;
        activeTabData.productos.forEach((producto, productoIndex) => {
            const importe = producto.Precio * producto.Cantidad * (1 - producto.descuento / 100);
            activeTabData.productos[productoIndex].importe = importe;
            if (!descuentoA) {
                if (producto.descuento !== 0) {
                    activeTabData.botonGlobal = true;
                    descuentoA = true;
                }
                else {
                    activeTabData.botonGlobal = false;
                }
            }
        });
        if (activeTabData.productos.length === 0) {
            activeTabData.botonGlobal = false;
        }

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
            const importe = producto.Precio * producto.Cantidad * (1 - producto.descuento / 100);
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
                else {
                    setButtonVisibility(true);
                }
            }
            // Intenta cargar el contador desde el almacenamiento local
            const storedCounter = localStorage.getItem('contadorFactura');
            if (storedCounter) {
                setContador(parseInt(storedCounter, 10)); // Convierte el valor almacenado a entero
            }
            const perfilGuardado = localStorage.getItem("usuarioC");
            if (perfilGuardado) {
                const perfil = JSON.parse(perfilGuardado);
                setUsuarioC(perfil);
            }
            const corteData = localStorage.getItem('corteId');
            setCorte(corteData || "");
        });
    }, []);
    const generarPDF = (dato) => {
        console.log(dato)
        const doc = new jsPDF();
        var numArticulos = 0;

        // Configuración de fuente y tamaño para el encabezado
        doc.setFontSize(10);
        doc.text(`${dato.Encabezado.Dueño.Nombre}`, 95, 10);
        doc.text(`${dato.Encabezado.Dueño.Cedula}`, 70, 10);
        doc.text('FACEBOOK: HOMAS OUTLET', 75, 20);
        doc.text(`CORREO: ${dato.Encabezado.CorreoSede}`, 67, 30);
        doc.text(`TELÉFONO: ${dato.Encabezado.Telefono}`, 78, 40);
        doc.text(`FECHA: ${dato.Fecha}`, 90, 50);
        doc.text(`Cajero: ${dato.Cajero}`, 10, 60);
        doc.setFontSize(12);

        // Contenido de la factura
        doc.text(`CANTIDAD`, 10, 70);
        doc.text(`DESCRIPCIÓN `, 70, 70);
        doc.text(`IMPORTE `, 145, 70);
        doc.text(`========================================================================================================`, 1, 80);

        let yOffset = 90; // Posición vertical inicial para los productos

        for (let index = 0; index < dato.Productos.length; index++) {
            doc.text(`${dato.Productos[index].Cantidad}`, 15, yOffset);
            doc.text(`${dato.Productos[index].Nombre}`, 60, yOffset);
            doc.text(`${dato.Productos[index].Precio}`, 150, yOffset);
            numArticulos += dato.Productos[index].Cantidad;
            yOffset += 10; // Ajuste vertical para el siguiente producto
        }
        doc.text(`========================================================================================================`, 1, yOffset);
        doc.text(`No.Artículos: ${numArticulos || ''}`, 40, yOffset + 10);
        doc.setFontSize(10);
        doc.text(`TOTAL: ${dato.Total}`, 125, yOffset + 10);
        doc.text(`SE HA RECIBIDO: ${dato.pagoCliente}`, 5, yOffset + 20);
        doc.text(`SE HA DEVUELTO: ${dato.vuelvoCliente}`, 90, yOffset + 20);
        doc.text(`USTED HA AHORRADO: ${dato.Descuento}`, 145, yOffset + 20);
        doc.text(`¡¡GRACIAS POR SU COMPRA!!`, 80, yOffset + 40);
        doc.text('LOS ARTÍCULOS ELÉCTRICOS TIENEN UN MES DE GARANTÍA.', 60, yOffset + 50);
        doc.text('EL CAJERO DEBE COMPROBAR EL ESTADO DE LOS ARTÍCULOS ANTES DE SALIR DE LA TIENDA.', 25, yOffset + 60);

        // Descargar el PDF
        doc.save('Homas_Factura.pdf');
    };
    useEffect(() => {
        // Actualiza el almacenamiento local cada vez que cambia el estado de las facturas
        localForage.setItem('facturas', tabs);
    }, [tabs, tabs[activeTab].content.productos]);

    const auxiliar = (index) => {
        localStorage.setItem('ta', index);
        setActiveTab(index)
        setActualizaTab(true);
    }

    useEffect(() => {
        // Actualiza el almacenamiento local cada vez que cambia el contador
        localStorage.setItem('contadorFactura', newContador);
    }, [newContador]);

    const proA = async (activeTabData) => {
        let cv = 0;
        let c = 0;
        try {
            // Iterar sobre cada departamento actualizado y actualizar en Firestore
            const departamentosRef = collection(dbPVH, "Producto");

            for (const dep of activeTabData.content.productos) {
                cv = dep.vT + dep.Cantidad;
                c = dep.existencia - dep.Cantidad;
                const q = query(departamentosRef, where("CodigoBarras", "==", dep.codigoBarras));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (d) => {
                    const departamentoRef = doc(dbPVH, "Producto", d.id);
                    await updateDoc(departamentoRef, {
                        CantidaVendidos: parseFloat(cv),
                        Cantidad: parseFloat(c),
                    });
                });
            }
            console.log("Cambios en productos subidos con éxito");
        } catch (error) {
            console.error("Error al subir cambios en productos: ", error);
        }
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
            const importe = producto.Precio * producto.Cantidad * (1 - producto.descuento / 100);
            producto.importe = importe;
        });

        // Calcula el total sumando los importes de todos los productos
        const total = activeTabData.productos.reduce((acc, producto) => acc + producto.importe, 0);
        activeTabData.total = total;

        // Actualiza el estado de las pestañas

        setTabs(updatedTabs);
    };

    return (
        <Container>
            <TopNavBar />
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
                <form onSubmit={agregarProducto} className='insertar'>
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
                                    onClick={() => editarNombre(clien.nombre, clien.cedula)}
                                    className='dropdown-row'
                                    key={clien.idUser}
                                    value={clien.nombre}
                                    style={{ background: clien.morosidad ? '#F8D7DA' : 'transparent' }}
                                >{clien.nombre.toLowerCase()}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div className="discount-options">
                <form onSubmit={handleAplicarDescuentoGlobal} className='insertar'>
                    <input
                        type="number"
                        placeholder="Descuento global"
                        className='insertarDesc'
                        value={descuentoGlobal}
                        onChange={(e) => setDescuentoGlobal(e.target.value)}
                    />
                    <Button
                        color="primary"
                        type="submit"
                        disabled={tabs[activeTab].content.botonGlobal}
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
                                            <td>₡{producto.Precio}</td>
                                            <td>{producto.descuento}%</td>
                                            <td>{producto.Cantidad}</td>
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
                            <div className="totalCont">
                                Descuento: %{tab.content.descuentoGlobal}
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
        </Container>
    );
}

export default Factura;