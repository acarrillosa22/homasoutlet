import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Target-api.css';
import CustomAlert from '../../components/alert/alert';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hayRequests, setHayRequests] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [buttonTriggered, setButtonTriggered] = useState();
  const [selectedRow, setSelectedRow] = useState(null); // Nuevo estado para la fila seleccionada
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState("");
  const [tipoAlert, setTipoAlert] = useState("");
  const [selectedImages, setSelectedImages] = useState({});

  useEffect(() => {
    setTextoAlert("Buscando...")
    setTipoAlert("info")
    const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    const fetchData = async () => {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
      var texto = searchTerm.toString();
      for (var indice = 0; indice < numeros.length; indice++) {//Compureba si lo enviado en un codigo de barras
        if (texto.startsWith(numeros[indice])) {
          getAPIdata();
          break;
        }
      }

      try {
        const params = {
          api_key: "C5F82F479E554F4CB74B76553F529224"
        }

        // make the http GET request to RedCircle API
        axios.get('https://api.redcircleapi.com/account', { params })
          .then(response => {
            // print the JSON response from RedCircle API
            const requests = response.data.account_info.credits_remaining
            console.log(requests);
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
              api_key: "C5F82F479E554F4CB74B76553F529224",
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

  const handleImageSelection = (e, rowIndex, imageIndex) => {
    // Restringir la selección de imágenes a solo una en toda la tabla
    const updatedSelectedImages = {};

    if (e.target.checked) {
      updatedSelectedImages[rowIndex] = [imageIndex];
    }

    // Actualiza el estado de las imágenes seleccionadas
    setSelectedImages(updatedSelectedImages);
  };

  const handleSaveImages = () => {
    console.log(selectedRow)
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
          precioVenta: responseData[selectedRow].product['PrecioVenta'],
        };

        // Aquí puedes hacer algo con los datos y la única imagen seleccionada
        console.log('Datos de la fila y única imagen seleccionada:', dataToSave);
        const nombreProducto = dataToSave.title;
        const url = dataToSave.link;
        const marca = dataToSave.brand;
        const descripcion = dataToSave.feature_bullets;
        const imagen = dataToSave.images;
        const precioRefenrencia = dataToSave.price;
        const NombreDepartamento = dataToSave.department_id;
        const precioVenta = parseFloat(dataToSave.precioVenta);
        //Insertar a la base de datos


      } else {
        // Si no hay imágenes seleccionadas, muestra un mensaje o toma la acción que desees
        console.log('No se ha seleccionado ninguna imagen.');
      }
    }
  };

  return (
    <div className="app-container">
      <div className="search-container">
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ingresa código de barras o nombre del producto"
          className="search-input"
        />
        <button onClick={handleSearchClick} className="search-button">
          Buscar
        </button>
        <button onClick={handleSaveImages} className="save-button">
          Guardar Datos de fila
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
                      value={resultado.product.feature_bullets.join(', ')}
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
                    <input
                      type="text"
                      value={resultado.product.department_id}
                      onChange={(e) => handleInputChange(e, 'department_id')}
                    />
                  </td>
                  <td>{resultado.offers.primary.price}$</td>
                  <td>
                    <div className='Precio'>
                      <input
                        className="precio-pensado"
                        type="text"
                        placeholder='Ingresa tu precio estimado'
                        onChange={(e) => handleInputChange(e, 'PrecioVenta')}
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
    </div>
  );
}

export default App;
