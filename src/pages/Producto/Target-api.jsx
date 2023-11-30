import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Target-api.css';
import CustomAlert from '../../components/alert/alert';
import { uploadImageToStorageURL } from "../../firebase/firebase";
import appPVH from '../../firebase/firebase';
import { addDoc, collection, getFirestore, getDocs } from 'firebase/firestore';
import TopNavBar from '../../components/navbarC/navbar';
import { Container } from 'reactstrap';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
function TargetApi() {
  const db = getFirestore(appPVH);
  const [searchTerm, setSearchTerm] = useState('');
  const [hayRequests, setHayRequests] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [responseDataP, setResponseDataP] = useState(null);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [buttonTriggered, setButtonTriggered] = useState();
  const [selectedRow, setSelectedRow] = useState(null); // Nuevo estado para la fila seleccionada
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState("");
  const [tipoAlert, setTipoAlert] = useState("");
  const [selectedImages, setSelectedImages] = useState({});
  const [codigoBarra, setCodigoBarra] = useState(0);
  const [departamento, setDepartamento] = useState([]);
  const [producto, setProducto] = useState([]);
  let co = 1000000;
  const obtenerDepartamentos = async () => {
    try {
      const userRef = collection(db, "Departamento");
      const userSnapshot = await getDocs(userRef);
      const allDepartmentos = userSnapshot.docs
        .map((departament) => departament.data())
      setDepartamento(allDepartmentos);
    } catch (error) {
      console.error("Error al obtener departamentos: ", error);
    }
  };
  const obtenerProducto = async () => {
    try {
      const userRef = collection(db, "Producto");
      const userSnapshot = await getDocs(userRef);
      const allDepartmentos = userSnapshot.docs
        .map((departament) => departament.data())
        .filter((user) => user.Estado !== 1);
      setProducto(allDepartmentos);
    } catch (error) {
      console.error("Error al obtener departamentos: ", error);
    }
  };
  function esNumero(texto) {
    // La expresión regular ^\d+$ verifica que la cadena contenga solo dígitos (números)
    return /^\d+$/.test(texto);
  }
  let vandera = false;
  useEffect(() => {
    obtenerDepartamentos();
    obtenerProducto();
    setTextoAlert("Buscando...")
    setTipoAlert("info")
    const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    const fetchData = async () => {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
      var texto = searchTerm.toString();
      vandera = esNumero(texto);
      for (var indice = 0; indice < numeros.length; indice++) {//Compureba si lo enviado en un codigo de barras
        if (texto.startsWith(numeros[indice]) && vandera) {
          setCodigoBarra(parseFloat(texto))
          getAPIdata();
          break;
        }
      }
      if (!vandera) {
        co += producto.length;
        setCodigoBarra(co)
      }
      try {
        const params = {
          api_key: "7B6A3B8D610146BDB3DE5220A977E62D"
        }

        // make the http GET request to RedCircle API
        axios.get('https://api.redcircleapi.com/account', { params })
          .then(response => {
            // print the JSON response from RedCircle API
            const requests = response.data.account_info.credits_remaining
            if (requests === 0) {
              setHayRequests(false);
            }
          }).catch(error => {
            // catch and print the error
            console.log(error);
          })
        if (hayRequests) {
          const response = await axios.get('https://api.redcircleapi.com/request', {
            params: {
              api_key: "7B6A3B8D610146BDB3DE5220A977E62D",
              search_term: searchTerm,
              type: "search",
              include_out_of_stock: "true"
            }
          });
          const resultados = response.data.search_results;
          if (resultados.length > 0) {
            setResponseData(resultados.slice(0, 4)); // Mostrar hasta 4 resultados
            setSearchCompleted(true);
          } else {
            setTextoAlert("No se encontraron resultados")
            setTipoAlert("warning")
            setSearchCompleted(false);
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
            }, 4000);
          }
        }
        else {
          setTextoAlert("Ya no quedan requests")
          setTipoAlert("warning")
          setSearchCompleted(false);
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 4000);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error)
        setSearchCompleted(false);
        setTextoAlert("No se encontraron resultados")
        setTipoAlert("warning")
        setSearchCompleted(false);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 4000);
      }
    };

    function getAPIdata() {
      const proxyurl = "https://cors-anywhere.herokuapp.com/"; // Use a proxy to avoid CORS error
      const api_key = "fhhwxck70w1k5i1rfai349jz3e02u4";
      const url = proxyurl + "https://api.barcodelookup.com/v3/products?barcode=" + searchTerm + "&formatted=y&key=" + api_key;
      fetch(url)
        .then(response => response.json())
        .then((data) => {
          setSearchTerm(data.products[0].title);//Asigna el termino encontrado el nombre del producto
        })
        .catch(err => {
          throw err
        });
    }
    function handleKeyPress(e) {
      if (e.key === 'Enter') {
        fetchData();
      }
    }

    function pressedButton(boton) {
      if (boton) {
        fetchData();
        setButtonTriggered(false);
      }
    }

    window.addEventListener('keydown', handleKeyPress);
    pressedButton(buttonTriggered);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [searchTerm, buttonTriggered]);

  const handleSearchClick = () => {
    setButtonTriggered(true);
  };

  const handleRowSelection = (index) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === index ? null : index));
  };

  const handleInputChange = (e, key) => {
    if (selectedRow !== null) {
      // Copiar el estado actual de responseData para no mutarlo directamente
      const updatedData = [...responseData];
      // Actualizar el valor correspondiente
      updatedData[selectedRow].product[key] = e.target.value;
      // Actualizar el estado con los nuevos datos
      setResponseData(updatedData);
    }
  };
  const handleInputChangePrecio = (e) => {
    setResponseDataP(e.target.value);
  };
  const handleImageSelection = (e, rowIndex, imageIndex) => {
    // Restringir la selección de imágenes a solo una en toda la tabla
    const updatedSelectedImages = {};
    if (e.target.checked) {
      updatedSelectedImages[rowIndex] = [imageIndex];
    }
    // Actualiza el estado de las imágenes seleccionadas
    setSelectedImages(updatedSelectedImages);
  };

  async function handleExportToExcel() {
    try {
      if (selectedRow !== null) {
        const dataToSave = {
          CodigoDeBarras: codigoBarra,
          Nombre: responseData[selectedRow].product.title,
          Descripcion: responseData[selectedRow].product.feature_bullets.join(', '),
          LinkImagenes: responseData[selectedRow].product.main_image,
          Marca: responseData[selectedRow].product.brand,
          Departamento: responseData[selectedRow].product.department_id,
          PrecioRefenrencia: responseData[selectedRow].offers.primary.price,
          PrecioVenta: responseDataP,
          URL: responseData[selectedRow].product.link
        };
        // Crear un archivo Excel
        const worksheet = XLSX.utils.json_to_sheet([dataToSave]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Producto');

        // Guardar el archivo Excel
        XLSX.writeFile(workbook, `${codigoBarra}.xlsx`);

        // Crear un archivo zip
        const zip = new JSZip();
        const images = dataToSave.LinkImagenes;

        // Agregar el archivo xlsx al zip
        zip.file(`${codigoBarra}.xlsx`);

        // Descargar imágenes en la carpeta del zip
        for (let index = 0; index < images.length; index++) {
          const imageUrl = images[index];
          const imageExtension = 'png';
          const imageName = `imagen_${index + 1}.${imageExtension}`;
          const response = await fetch(imageUrl);

          if (!response.ok) {
            throw new Error(`Failed to fetch image ${index + 1}`);
          }

          const imageBlob = await response.blob();

          // Agregar la imagen al zip
          zip.file(`${codigoBarra}_imagenes/${imageName}`, imageBlob);
        }

        // Crear el archivo zip
        const zipBlob = await zip.generateAsync({ type: 'blob' });

        // Crear una URL para el zip y crear un enlace para descargar
        const zipURL = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = zipURL;
        link.download = `${codigoBarra}_imagenes.zip`;

        // Agregar el enlace al documento y simular el clic
        document.body.appendChild(link);
        link.click();

        // Limpiar después de la descarga
        document.body.removeChild(link);
        URL.revokeObjectURL(zipURL);
        setCodigoBarra(0);
      }
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      // Manejar el error según sea necesario
    }
  }

  const guardar = async (dataToSave) => {
    const nombreProducto = dataToSave.title;
    const marca = dataToSave.brand;
    const descripcion = dataToSave.feature_bullets;
    const imagen = dataToSave.main_image;
    const precioRefenrencia = dataToSave.price;
    const departa = dataToSave.departamentoE;
    const imageUrl = await uploadImageToStorageURL(imagen, "ImagenesProducto");
    try {
      await addDoc(collection(db, "Producto"), {
        Nombre: nombreProducto,
        CodigoBarras: codigoBarra,
        Precio: parseFloat(responseDataP),
        Marca: marca,
        Cantidad: 1,
        Estado: 0,
        NombreDepartamento: departa,
        PrecioReferencia: parseFloat(precioRefenrencia),
        Image: imageUrl,
        Descripcion: descripcion[0],
        PrecioLiquidacion: 0,
        CantidaVendidos: 0
      });
      setTextoAlert("Producto agregado y documentado en Firestore");
      setTipoAlert("success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
      setCodigoBarra(0);
    } catch (error) {
      console.error("Error al crear producto y documentar en Firestore: ", error);
    }
  }
  const handleSaveImages = () => {
    if (selectedRow !== null) {
      // Verifica si hay al menos una imagen seleccionada
      if (selectedImages[selectedRow] && selectedImages[selectedRow].length > 0) {
        // Accede a las imágenes seleccionadas por fila
        const selectedImageIndices = selectedImages[selectedRow];
        // Accede a las imágenes correspondientes a los índices seleccionados
        const selectedImagesForRow = selectedImageIndices.map(
          (imageIndex) => responseData[selectedRow].product.images[imageIndex]
        );

        // Crea un objeto con los datos de la fila y la única imagen seleccionada
        const dataToSave = {
          ...responseData[selectedRow].product,
          images: [selectedImagesForRow[0]], // Tomar solo la primera imagen seleccionada
          price: responseData[selectedRow].offers.primary.price,
          departamentoE: responseData[selectedRow].selectedDepartment,
          PrecioVenta: responseData[selectedRow].product['PrecioVenta'],
        };
        guardar(dataToSave);
      } else {
        // Si no hay imágenes seleccionadas, muestra un mensaje o toma la acción que desees
        setTextoAlert("No se ha seleccionado ninguna imagen.");
        setTipoAlert("warning");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 1500);
        setCodigoBarra(0);
      }
    } else {
      // Si no hay imágenes seleccionadas, muestra un mensaje o toma la acción que desees
      setTextoAlert("No se ha seleccionado ninguna imagen.");
        setTipoAlert("warning");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 1500);
        setCodigoBarra(0);
    }
  };

  return (
    <Container>
      <TopNavBar />
      <div className="search-containerApi">
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ingresa código de barras o nombre del producto"
          className="search-inputApi"
        />
        <button onClick={handleSearchClick} className="search-buttonApi">
          Buscar
        </button>
        <button onClick={handleSaveImages} className="save-buttonApi">
          Guardar Datos de fila
        </button>
        <button onClick={handleExportToExcel} className="save-buttonApi">
          Exportar a datos excel
        </button>
      </div>
      {searchCompleted && responseData && (
        <div className="table-container">
          <table className="result-table">
            <thead>
              <tr>
                <th>Nombre del producto</th>
                <th>Descripción</th>
                <th>Imágenes</th>
                <th>Marca</th>
                <th>Nombre del departamento</th>
                <th>Precio en dólares</th>
                <th>Precio en colones planeado</th>
                <th>URL directa</th>
              </tr>
            </thead>
            <tbody>
              {responseData.map((resultado, index) => (
                <tr
                  key={index}
                  className={index === selectedRow ? 'selected-row' : ''}
                  onClick={() => handleRowSelection(index)}
                >
                  <td>
                    <input
                      className="resultado"
                      type="text"
                      value={resultado.product.title}
                      onChange={(e) => handleInputChange(e, 'title')}
                    />
                  </td>
                  <td>
                    <input
                      className="resultado"
                      type="text"
                      value={resultado.product.feature_bullets.join(', ') || ''}
                      onChange={(e) => handleInputChange(e, 'feature_bullets')}
                    />
                  </td>
                  <td className="image-container">
                    {resultado.product.images.slice(0, 4).map((image, imgIndex) => (
                      <div key={imgIndex} className="image-item">
                        <img
                          src={image}
                          alt={`Imagen ${imgIndex}`}
                          className="product-image"
                        />
                        <input
                          type="radio"
                          checked={
                            selectedImages[index] &&
                            selectedImages[index].includes(imgIndex)
                          }
                          onChange={(e) => handleImageSelection(e, index, imgIndex)}
                        />
                      </div>
                    ))}
                  </td>
                  <td>
                    {resultado.product.brand}
                  </td>
                  <td>
                    <select
                      className="form-control"
                      value={resultado.selectedDepartment}
                      onChange={(e) => {
                        const updatedData = [...responseData];
                        updatedData[index].selectedDepartment = e.target.value;
                        setResponseData(updatedData);
                      }}
                    >
                      <option value="">Selecciona un Departamento</option>
                      {departamento.map((encargado) => (
                        <option key={encargado.id} value={encargado.Nombre}>
                          {encargado.Nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{resultado.offers.primary.price}$</td>
                  <td>
                    <div className='Precio'>
                      <input
                        className="precio-pensado"
                        type="number"
                        placeholder='Ingresa tu precio estimado'
                        value={responseDataP}
                        onChange={(e) => handleInputChangePrecio(e)}
                      />
                      <span className="currency-symbol">₡</span>
                    </div>
                  </td>
                  <td>
                    <a href={resultado.product.link} target="_blank" rel="noopener noreferrer" className="product-link">
                      Ver producto
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showAlert && (
        <CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />
      )}
    </Container>
  );
}

export default TargetApi;


