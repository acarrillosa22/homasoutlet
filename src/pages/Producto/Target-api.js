import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Target-api.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [buttonTriggered, setButtonTriggered] = useState();
  const [selectedImages, setSelectedImages] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      window.alert("Buscando producto...");
      try {
        const response = await axios.get('https://api.redcircleapi.com/request', {
          params: {
            api_key: "D5BE2EF568A54782938EEA35546E0B27",
            search_term: searchTerm,
            category_id: "5zja3",
            type: "search"
          }
        });
        
        const resultados = response.data.search_results;
        if (resultados !== undefined) {
          if (resultados.length > 0) {
            setResponseData(resultados.slice(0, 5)); // Mostrar hasta 5 resultados
            setSearchCompleted(true);
          } else {
            setSearchCompleted(false);
            window.alert("No se encontraron resultados");
          }
        }
        else{
          window.alert("No se encontraron resultados")
        }

      } catch (error) {
        window.alert("Error con la búsqueda");
        console.error('Error en la solicitud:', error)
        setSearchCompleted(false);
      }
    };

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

  const handleInputChange = (e, index, key) => {
    // Copiar el estado actual de responseData para no mutarlo directamente
    const updatedData = [...responseData];
    // Actualizar el valor correspondiente
    updatedData[index].product[key] = e.target.value;
    // Actualizar el estado con los nuevos datos
    setResponseData(updatedData);
  };

  const handleImageSelection = (e, rowIndex, imageIndex) => {
    // Copia el estado actual de las imágenes seleccionadas
    const updatedSelectedImages = { ...selectedImages };

    // Si la fila no existe en el estado, inicialízala con un arreglo vacío
    if (!updatedSelectedImages[rowIndex]) {
      updatedSelectedImages[rowIndex] = [];
    }

    // Si la imagen está seleccionada, agrégala; de lo contrario, retírala
    if (e.target.checked) {
      updatedSelectedImages[rowIndex].push(imageIndex);
    } else {
      updatedSelectedImages[rowIndex] = updatedSelectedImages[rowIndex].filter(
        (index) => index !== imageIndex
      );
    }

    // Actualiza el estado de las imágenes seleccionadas
    setSelectedImages(updatedSelectedImages);
  };

  const handleSaveImages = () => {
    // Accede a las imágenes seleccionadas por fila
    Object.keys(selectedImages).forEach((rowIndex) => {
      const selectedImageIndices = selectedImages[rowIndex];
      // Accede a las imágenes correspondientes a los índices seleccionados
      const selectedImagesForRow = selectedImageIndices.map(
        (imageIndex) => responseData[rowIndex].product.images[imageIndex]
      );
      // Aquí puedes hacer algo con las imágenes seleccionadas, como guardarlas
      console.log(
        `Imágenes seleccionadas en la fila ${rowIndex}:`,
        selectedImagesForRow
      );
    });
  };

  return (
    <div className="app-container">
      <div className="search-container">
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar..."
          className="search-input"
        />
        <button onClick={handleSearchClick} className="search-button">
          Buscar
        </button>
        <button onClick={handleSaveImages} className="save-button">
          Guardar Imágenes Seleccionadas
        </button>
      </div>
      {searchCompleted && responseData && (
        <div className="table-container">
          <table className="result-table">
            <thead>
              <tr>
                <th>Nombre del prdoucto</th>
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
                <tr key={index}>
                  <td>
                    <input
                      class="resultado"
                      type="text"
                      value={resultado.product.title}
                      onChange={(e) => handleInputChange(e, index, 'title')}
                    />
                  </td>
                  <td>
                    <input
                      class="resultado"
                      type="text"
                      value={resultado.product.feature_bullets.join(', ')}
                      onChange={(e) => handleInputChange(e, index, 'feature_bullets')}
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
                          type="checkbox"
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
                      onChange={(e) => handleInputChange(e, index, 'department_id')}
                    />
                  </td>
                  <td>{resultado.offers.primary.price}$</td>
                  <td>
                    <div className='Precio'>
                      <input
                        className="precio-pensado"
                        type="text"
                        placeholder='Ingresa tu precio estimado'
                        onChange={(e) => handleInputChange(e, index, 'Precio de venta')}
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
    </div>
  );
}

export default App;
