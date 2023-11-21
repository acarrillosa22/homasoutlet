import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./estilo.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalA from "../../components/modal-editar/modal-editar-departamentos";
//Firebase
import { Button, Container } from "reactstrap";
import appHOT from "../../firebase/firebaseHOT"; // Llama a donde tengo la configuracion de la aplicacion que usa la base
import { getFirestore } from "firebase/firestore"; // Llamo lo que necesito usar para la los metodos de traer docs etc
import { getAuth } from "firebase/auth";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
//fortawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TopNavBar from "../../components/navbarC/navbar";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft);

function PerfilM() {
    const nombre = "Cliente";
    const db = getFirestore(appHOT);
    const [usuario, setUsuario] = useState({});
    const [isOpenActualizar, openModalActualizar, closeModalActualizar] = useModal(false);
    const abrirModalActualizar = (cedula) => {
        setUsuario(cedula);
        openModalActualizar();
    };
    const fieldOrderEditar = {
        1: "nombre", // Primer campo en aparecer
        2: "telefono",
        3: "correoElectronico",
        4: "contraseña",
      };
    useEffect(() => {
        // Intenta obtener la información del perfil desde el almacenamiento local
        const perfilGuardado = localStorage.getItem("perfil");

        if (perfilGuardado) {
            const perfil = JSON.parse(perfilGuardado);
            setUsuario(perfil);
        } else {
            // Puedes manejar la ausencia de un perfil guardado aquí, por ejemplo, redirigiendo al usuario.
        }
    }, []);

    const editar = async (form) => {
        const cedula = usuario.cedula;

        try {
            const user = doc(db, "Usuarios", cedula);
            await updateDoc(user, {
                nombre: form.nombre,
                telefono: form.telefono,
                correoElectronico: form.correoElectronico,
                contraseña: form.contraseña,
            });

            // Actualiza la información del perfil con los nuevos datos
            const perfilActualizado = { ...usuario, ...form };
            setUsuario(perfilActualizado);

            // Guarda la información actualizada en el almacenamiento local
            localStorage.setItem("perfil", JSON.stringify(perfilActualizado));

            window.alert("Se actualizó con éxito");
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
                    <p>Cedula: {usuario.cedula}</p>
                    <p>Telefono: {usuario.telefono}</p>
                    <p>Correo: {usuario.correoElectronico}</p>
                    <p>Contraseña: {usuario.contraseña}</p>
                    <p>Dirección: {usuario.direccionExacta}</p>
                    <button onClick={() => abrirModalActualizar(usuario)}>Editar Perfil</button>
                </div>
            )}
            <ModalA
                isOpenA={isOpenActualizar}
                closeModal={closeModalActualizar}
                elemento={usuario}
                FuntionEdit={editar}
                fieldOrder={fieldOrderEditar}
                nombreCrud={nombre}
            />
        </Container>
    );
}
export default PerfilM;