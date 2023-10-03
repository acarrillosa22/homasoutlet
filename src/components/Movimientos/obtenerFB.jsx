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
  const [formaPago, setFormaPago] = useState(0);
  const [id, setId] = useState(0);
  const [informacion, SetInformacion] = useState("");
  const [pieDePagina, setPieDePagina] = useState("");
  const [total, setTotal] = useState(0);
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
          setFormaPago(data.FormaDePago || 0);
          setId(data.id || 0);
          SetInformacion(data.Informacion || '');
          setPieDePagina(data.PieDePagina || '');
          setTotal(data.Total || 0);
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

    // Configuración de fuente y tamaño para el encabezado
    doc.setFontSize(25);
    doc.text(`${encabezado.NombreE}`, 75, 20);
    doc.setFontSize(15);
    doc.text(`${encabezado.Dueño.Nombre}`, 65, 30);
    doc.text(`${encabezado.Dueño.Cedula}`, 110, 30);
    doc.text('Facebook: Homas Outlet', 70, 40);
    doc.text('homasoutlet@gmail.com', 70, 60);
    doc.text(`Teléfono: 6099 8945${cajero.Telefono}`, 72, 50);
    doc.text(`Fecha: ${fechaActual}`, 75, 70);
    doc.setFontSize(20);

    // Contenido de la factura
    doc.text(`Cajero: ${cajero.Nombre}`, 10, 90);
    doc.text(`Folio: ${id}`, 10, 100);
    doc.text(`Cantidad`, 10, 120);
    doc.text(`Descripción `, 80, 120);
    doc.text(`Importe `, 140, 120);
    doc.text(`=====================================================`, 1, 130);
    doc.text(`${producto.Cantidad}`, 10, 140);
    doc.text(`${producto.Nombre}`, 80, 140);
    doc.text(`${producto.Precio}`, 80, 160);
    doc.text(`=====================================================`, 1, 150);
    doc.text(`NO.ARTICULOS ${producto.cantidad}`, 70, 170);
    doc.setFontSize(30);
    doc.text(`TOTAL: ${total}`, 70, 190);
    doc.text(` ${formaPago}`, 50, 210);
    doc.setFontSize(20);
    doc.text(`Referencia:`, 90, 230);
    doc.text(`${cliente}`, 85, 240);
    doc.setFontSize(12);
    doc.text(`${informacion}`, 75, 250);
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