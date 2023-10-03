import  appFirebase  from "../../firebase/firebase.js"
import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button } from "reactstrap";
import { updateDoc, doc, getFirestore, where, query, collection, getDocs } from "firebase/firestore";

function ModalED({ isOpenED, closeModal, IDdepartamento, onCreateDepartamento}) {

    const db = getFirestore(appFirebase);

    const initialFormState = {
        nombre: '',
        estado: '',
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

    const [departamentoEncontrado, setDepartamentoEncontrado] = useState(null);
    
    const editar = async () => {
      try {

        let encontrado = '';

        const q = query(collection(db, "Departamento"), where("ID", "==", Number(IDdepartamento)));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          encontrado =  doc.id;
        });

        const docrefence = doc(db, "Departamento", encontrado);
        console.log(docrefence);

        console.log(IDdepartamento);
        console.log(encontrado);
        console.log('Formulario:', form);

    
        if (encontrado) {
          await updateDoc(docrefence ,{
            Nombre: form.nombre,
            Estado: form.estado,
            Descripcion: form.descripcion
          });
    
          console.log("Document successfully updated!");
          closeModal();
          window.alert("Se actualizó el departamento con éxito");
          onCreateDepartamento();
        } else {
          console.log("No se encontró el departamento con el ID especificado.");
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
              <label>nombre:</label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </FormGroup>
    
            <FormGroup>
                <label>estado:</label>
                <input
                className="form-control"
                type="int"
                name="estado"
                value={form.estado}
                onChange={handleChange} 
                />
            </FormGroup>
    
            <FormGroup>
                <label>descripción:</label>
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

export default ModalED;