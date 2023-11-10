import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc, addDoc } from "firebase/firestore";
import CustomAlert from '../../components/alert/alert';
import './Target-api.css';
import ModalCrear from '../../components/modal-crear/modal-crear-departamentos';
import { Modal, ModalHeader, ModalBody, FormGroup, ModalFooter } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hayRequests, setHayRequests] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [buttonTriggered, setButtonTriggered] = useState();
  const [departa, setDeparta] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState("");
  const [tipoAlert, setTipoAlert] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const db = getFirestore(appPVH);
  const obtenerDepartamentos = async (page) => {
    try {
      const userRef = collection(db, "Departamento");
      const userSnapshot = await getDocs(userRef);
      setDeparta(userSnapshot.docs.map((departament) => departament.data()));
    } catch (error) {
      console.error("Error al obtener departamentos: ", error);
    }
  };
  useEffect(() => {
    const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    const fetchData = async () => {
      setTextoAlert("Buscando.....")
      setTipoAlert("success")
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2500);
      var texto = searchTerm.toString();
      for (var indice = 0; indice < numeros.length; indice++) {//Compureba si lo enviado en un codigo de barras
        if (texto.startsWith(numeros[indice])) {
          getAPIdata()
          if (searchTerm) {

          }
          break;
        }
      }
      try {
        const params = {
          api_key: "D5BE2EF568A54782938EEA35546E0B27"
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
              api_key: "D5BE2EF568A54782938EEA35546E0B27",
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
            setTextoAlert("Verefique el nombre o codigo ingresado")
            setTipoAlert("warning")
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
            }, 2000);
          }
        }
        else {
          setTextoAlert("No quedan consultas disponibles para la busqueda automatica actualise el plan o espere a la fecha de renovacion")
          setTipoAlert("warning")
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }

      } catch (error) {
        console.error('Error en la solicitud:', error)
        setSearchCompleted(false);
        setSearchCompleted(false);
        setTextoAlert("No se encontraron resultados...")
        setTipoAlert("warning")
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2500);
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
  const handleSaveProduct = async () => {
    try {
      // Crear un arreglo para almacenar los productos seleccionados
      const productosSeleccionados = [];

      // Iterar a través de los resultados
      responseData.forEach((resultado, index) => {
        // Verificar si se ha seleccionado alguna imagen
        if (selectedImages[index] && selectedImages[index].length > 0) {
          const producto = resultado.product;

          // Crear un objeto con los datos del producto seleccionado
          const productoSeleccionado = {
            Nombre: producto.title,
            Marca: producto.brand,
            Codigo: producto.codigo, // Asegúrate de que la API proporcione un código si no, ajusta esta parte
            Descripcion: producto.feature_bullets.join(', '),
            Departamento: producto.department_id,
            PrecioDolares: producto.offers.primary.price,
            PrecioColones: producto.precioVenta, // Ajusta esta parte según tu lógica
            Imagen: producto.images.slice(0, 4), // Guarda solo las primeras 4 imágenes
            URL: producto.link,
          };

          productosSeleccionados.push(productoSeleccionado);
        }
      });

      if (productosSeleccionados.length > 0) {
        // Aquí puedes guardar los productos seleccionados en Firestore
        const db = getFirestore(appPVH);

        productosSeleccionados.forEach(async (producto) => {
          await addDoc(collection(db, "Productos"), producto);
        });

        // Limpia las imágenes seleccionadas
        setSelectedImages({});

        console.log("Productos seleccionados guardados en Firestore");
        window.alert("Productos seleccionados guardados con éxito");
      } else {
        console.log("Ningún producto seleccionado para guardar");
        window.alert("No se ha seleccionado ningún producto para guardar");
      }
    } catch (error) {
      console.error("Error al guardar productos en Firestore: ", error);
      window.alert("Ocurrió un error al guardar los productos");
    }
  };

  return (
    <Container>
      <div className="search-container">
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ingresa código de barras o nombre del producto"
          className="search-input"
        />
        <Button onClick={handleSearchClick} className="search-button">
          Buscar
        </Button>
        <Button onClick={() => setIsModalOpen(true)} className="save-button">
          <FontAwesomeIcon icon={faSave} /></Button>
      </div>
      {searchCompleted && responseData && (
        <div className="table-container">
          <Table>
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
                <tr key={index}>
                  <td>
                    <input
                      class="resultado"
                      type="text"
                      value={resultado.product.title}
                      onChange={(e) => handleInputChange(e, index, 'title')}
                    />
                  </td>
                  {/* ... (otras celdas) */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {showAlert && <CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />}
      <ModalCrear
        isOpenA={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onCreateUsuario={handleSaveProduct} // Puedes modificar el nombre de la función si es necesario
      />
    </Container>
  );
}

export default App;
