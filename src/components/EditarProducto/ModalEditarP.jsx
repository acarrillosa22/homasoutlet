import  appFirebase  from "../../firebase/firebase.js"
import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button } from "reactstrap";
import { updateDoc, doc, getFirestore, where, query, collection, getDocs } from "firebase/firestore";

function ModalEP({ isOpenED, closeModal, IDProducto, onCreateProducto}) {

    const db = getFirestore(appFirebase);

    const initialFormState = {
        nombre: '',
        precio: '',
        cantidad: '',
        imagen: '',
        descripcion: ''
    };

    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
    // Reset the form whenever isOpenA changes (modal is opened/closed)
        if (!isOpenED) {
            resetForm();
        }
    }, [isOpenED]);
    const resetForm = () => {
        setForm(initialFormState);
    };
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const cerrarModalActualizar = () => {
        closeModal();
    };

    const [productoEncontrado, setProductoEncontrado] = useState(null);
    
    const editar = async () => {
      try {

        let encontrado = '';

        const q = query(collection(db, "Producto"), where("Id", "==", IDProducto));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          encontrado =  doc.id;
        });

        const docrefence = doc(db, "Producto", encontrado);
        console.log(docrefence);

        console.log(IDProducto);
        console.log(encontrado);
        console.log('Formulario:', form);

    
        if (encontrado) {
          await updateDoc(docrefence ,{
            Nombre: form.nombre,
            Precio: form.precio,
            Image:form.imagen,
            Cantidad:form.cantidad,
            Descripcion: form.descripcion
          });
    
          console.log("Document successfully updated!");
          closeModal();
          window.alert("Se actualizó el producto con éxito");
          onCreateProducto();
        } else {
          console.log("No se encontró el producto con el ID especificado.");
        }
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    };

    return (
        <Modal isOpen={isOpenED} toggle={cerrarModalActualizar} backdrop="static">
          <ModalHeader>
            <div>
              <h3>Editar departamentos</h3>
            </div>
          </ModalHeader>
    
          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </FormGroup>
    
            <FormGroup>
                <label>Precio:</label>
                <input
                className="form-control"
                type="int"
                name="precio"
                value={form.precio}
                onChange={handleChange} 
                />
            </FormGroup>
            <FormGroup>
                <label>Cantidad:</label>
                <input
                className="form-control"
                type="int"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange} 
                />
            </FormGroup>
            <FormGroup>
                <label>Imagen:</label>
                <input
                className="form-control"
                type="int"
                name="imagen"
                value={form.imagen}
                onChange={handleChange} 
                />
            </FormGroup>
            <FormGroup>
                <label>Descripción:</label>
                <input
                className="form-control"
                type="text"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                />
            </FormGroup>
          </ModalBody>
    
          <ModalFooter>
            <Button color="primary" onClick={() => editar(form)}>
              Editar
            </Button>
            <Button color="danger" onClick={cerrarModalActualizar}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
    );
}

export default ModalEP;