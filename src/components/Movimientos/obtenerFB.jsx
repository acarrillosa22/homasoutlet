import React, { useEffect, useState } from 'react';
import { getFirestore, setDoc, collection, doc, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import { format } from 'date-fns';


const ObtenerFB = () => {
  // Estado para almacenar los datos de la factura
  const [cajero, setCajero] = useState({});
  const [cliente, setCliente] = useState({});
  const [encabezado, setEncabezado] = useState({});
  const [producto, setProducto] = useState({});
  const [descuento, setDescuento] = useState(0);
  const [estado, setEstado] = useState(0);
  const [fecha, setFecha] = useState("");
  const [total, setTotal] = useState(0);
  const [pagoCliente, setPago] = useState(0);
  const [vueltoCliente, setVuelto] = useState(0);
  const fechaActual = format(new Date(), 'dd/MM/yyyy HH:mm:ss');


  // Cargar datos de la factura al montar el componente
  useEffect(() => {
    const db = getFirestore();
    const facturaDocRef = doc(db, 'Factura', 'Odc3s1FRjib9e2LOTmz2');

    getDoc(facturaDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          // Actualizar el estado con los datos de la factura
          setCajero(data.Cajero || {});
          setCliente(data.Cliente || {});
          setEncabezado(data.Encabezado || {});
          setProducto(data.Producto || {});
          setDescuento(data.Descuento || 0);
          setEstado(data.Estado || 0);
          setFecha(data.Fecha || '');
          setTotal(data.Total || 0);
          setPago(data.pagoCliente || 0);
          setVuelto(data.vueltoCliente|| 0);

        } else {
          console.log('El documento no existe.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener el documento:', error);
      });
  }, []);

  // Función para generar el PDF
  const generarPDF = () => {
    const doc = new jsPDF();

    const elTotal = producto.Precio;
    const numArticulos = producto.Cantidad;
    const totalConDescuento = elTotal - producto.Descuento;
    const vueltoDar = pagoCliente - totalConDescuento;

    // Configuración de fuente y tamaño para el encabezado
    doc.setFontSize(25);
    doc.text(`${encabezado.NombreE}`, 75, 20);
    doc.setFontSize(15);
    doc.text(`${encabezado.Dueño.Nombre}`, 100, 30);
    doc.text(`${encabezado.Dueño.Cedula}`, 65, 30);
    doc.text('FACEBOOK: HOMAS OUTLET', 75, 40);
    doc.text(`CORREO:${encabezado.CorreoSede}`, 60, 60);
    doc.text(`TELÉFONO: ${encabezado.Telefono}`, 85, 50);
    doc.text(`${fechaActual}`, 85, 70);
    doc.setFontSize(20);

    // Contenido de la factura
    doc.text(`CAJERO: ${cajero.Nombre}`, 10, 90);
    doc.text(`FOLIO: ${estado}`, 10, 100);
    doc.text(`CANTIDAD`, 10, 120);
    doc.text(`DESCRIPCIÓN `, 70, 120);
    doc.text(`IMPORTE `, 140, 120);
    doc.text(`=====================================================`, 1, 130);
    doc.text(`${producto.Cantidad}`, 10, 140);
    doc.text(`${producto.Nombre}`, 50, 140);
    doc.text(`${producto.Precio}`, 150, 140);
    doc.text(`=====================================================`, 1, 150);
    doc.text(`NO.ARTICULOS: ${numArticulos || ''}`, 70, 170);
    doc.setFontSize(25);
    doc.text(`TOTAL: ${totalConDescuento || ''}`, 70, 190);
    doc.text(`SE HA RECIBIDO: ${pagoCliente}`, 40, 210);
    doc.text(`SE HA DEVUELTO: ${vueltoDar}`, 40, 230);
    doc.text(`USTED HA AHORRADO: ${producto.Descuento}`, 35, 250);
    doc.setFontSize(15);
    doc.text(`¡¡GRACIAS POR SU COMPRA!!`, 70, 270);
    doc.text('LOS ARTÍCULOS ELÉCTRICOS TIENEN UN MES DE GARANTÍA.', 40, 280);
    doc.text('EL CAJERO DEBE COMPROBAR EL ESTADO DE LOS ARTÍCULOS ANTES DE SALIR DE LA TIENDA.', 0, 290);

    // Descargar el PDF
    doc.save('mi_pdf.pdf');
  };

  return (
    <div>
      <h1>Generar PDF</h1>
      <button onClick={generarPDF}>Descargar PDF</button>
    </div>
  );
};

export default ObtenerFB;