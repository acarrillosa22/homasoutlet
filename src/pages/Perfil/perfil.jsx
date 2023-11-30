import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./estilo.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalA from "../../components/modal-editar/modal-editar-departamentos";
//Firebase
import {Container } from "reactstrap";
import appHOT from "../../firebase/firebaseHOT"; // Llama a donde tengo la configuracion de la aplicacion que usa la base
import { getFirestore, query, where } from "firebase/firestore"; // Llamo lo que necesito usar para la los metodos de traer docs etc
import {
    collection,
    getDocs,
    doc,
    updateDoc,
} from "firebase/firestore";
import CustomAlert from '../../components/alert/alert';
//fortawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TopNavBar from "../../components/navbarC/navbar";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft);

function PerfilM() {
    const nombre = "Perfil";
    const db = getFirestore(appHOT);
    const [usuario, setUsuario] = useState({});
    const [isOpenActualizar, openModalActualizar, closeModalActualizar] = useModal(false);
    const [showAlert, setShowAlert] = useState(false);
    const [textoAlert, setTextoAlert] = useState("");
    const [tipoAlert, setTipoAlert] = useState("");
    const abrirModalActualizar = (cedula) => {
        setUsuario(cedula);
        openModalActualizar();
    };
    const validateFieldCrear = (fieldName, value) => {
        const errors = {};
        let fieldErrors = { ...errors };

        switch (fieldName) {
            case "Telefono":
                fieldErrors.telefono =
                    value.length !== 8 || isNaN(Number(value))
                        ? "El teléfono debe tener 8 números y ser solo números"
                        : "";
                break;
                fieldErrors.CodigoBarras =
                    isNaN(Number(value)) || value.length < 6
                        ? "El código de barras debe ser un número con al menos 6 dígitos"
                        : "";
                break;
            default:
                break;
        }

        return fieldErrors;
    };
    const fieldOrderEditar = {
        1: "nombre", // Primer campo en aparecer
        2: "telefono",
    };

    const Etiquetas = {
        nombre: "Nombre",
        telefono: "Teléfono"
    };

    useEffect(() => {
        // Intenta obtener la información del perfil desde el almacenamiento local
        const perfilGuardado = localStorage.getItem("usuarioC");
        if (perfilGuardado) {
            const perfil = JSON.parse(perfilGuardado);
            setUsuario(perfil);
        }
    }, []);

    const editar = async (form) => {
        let cedula = usuario.cedula;
        const q = query(collection(db, "Usuarios"), where("cedula", "==", usuario.cedula));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            cedula = doc.id;
        });
        try {
            const user = doc(db, "Usuarios", cedula);
            await updateDoc(user, {
                nombre: form.nombre,
                telefono: form.telefono,
            });
            // Actualiza la información del perfil con los nuevos datos
            const perfilActualizado = { ...usuario, ...form };
            setUsuario(perfilActualizado);
            const usuarioCJSON = JSON.stringify(perfilActualizado);
            // Guardar la cadena JSON en localStorage
            localStorage.setItem('usuarioC', usuarioCJSON);
            setTextoAlert("Perfil modificado con éxito");
            setTipoAlert("success");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 1500);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    

    return (
        <Container>
            <TopNavBar />
            <h1>Mi Perfil</h1>
            {usuario && (
                <div>
                    <p>Nombre: {usuario.nombre}</p>
                    <p>Cédula: {usuario.cedula}</p>
                    <p>Teléfono: {usuario.telefono}</p>
                    <p>Correo: {usuario.correoElectronico}</p>
                    <button onClick={() => abrirModalActualizar(usuario)}>Editar Perfil</button>
                </div>
            )}
            <ModalA
                isOpenA={isOpenActualizar}
                closeModal={closeModalActualizar}
                elemento={usuario}
                validateField={validateFieldCrear}
                FuntionEdit={editar}
                fieldOrder={fieldOrderEditar}
                nombreCrud={nombre}
                Etiquetas={Etiquetas}
            />
            {showAlert && (<CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />)}
        </Container>
    );
}
export default PerfilM;