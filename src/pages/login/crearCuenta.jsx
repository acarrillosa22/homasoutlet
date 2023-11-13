import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import appPVH from "../../firebase/firebase";

import CustomAlert from "../../components/alert/alert";

function CrearCuenta({ onClose }) {
    const [modalEmail, setModalEmail] = useState("");
    const [modalPassword, setModalPassword] = useState("");
    const [modalConfirmPassword, setModalConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [textoAlert, setTextoAlert] = useState("");
    const [tipoAlert, setTipoAlert] = useState("");

    const abrirAlertCuenta = () => {
        setTextoAlert("Se ha creado su cuenta");
        setTipoAlert("success");
      };

    const handleEmailSignUp = () => {
        abrirAlertCuenta()
        if (modalPassword !== modalConfirmPassword) {
            setErrorMessage("Las contraseñas no coinciden");
            return;
        }

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, modalEmail, modalPassword)
            .then((userCredential) => {
                const user = userCredential.user;
                setShowAlert(true);
                setTimeout(() => {
                  setShowAlert(false);
                }, 4000);
                // Aquí puedes realizar acciones adicionales después del registro exitoso, si es necesario
            })
            
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/email-already-in-use') {
                    setErrorMessage('El correo electrónico proporcionado ya está en uso.');
                } else if (errorCode === 'auth/invalid-email') {
                    setErrorMessage('El correo electrónico proporcionado no es válido.');
                } else if (errorCode === 'auth/weak-password') {
                    setErrorMessage('La contraseña es demasiado débil. Intente con una contraseña más segura.');
                } else {
                    setErrorMessage(errorMessage);
                }
            });
           
    };

    return (
        <div className="container">
            <h1>Crear Cuenta</h1>
            <div className="image-container">
                <img src="logo.png" alt="Logo" />
            </div>
            <div className="container-correo">
                <label>Correo</label>
                <input
                    type="email"
                    placeholder="Ingrese su correo ..."
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                />
            </div>
            <div className="container-contraseña">
                <label>Contraseña</label>
                <input
                    type="password"
                    placeholder="Ingrese su contraseña ..."
                    value={modalPassword}
                    onChange={(e) => setModalPassword(e.target.value)}
                />
            </div>
            <div className="container-contraseña">
                <label>Confirmar Contraseña</label>
                <input
                    type="password"
                    placeholder="Confirme su contraseña ..."
                    value={modalConfirmPassword}
                    onChange={(e) => setModalConfirmPassword(e.target.value)}
                />
            </div>
            <h6>Por favor, crea una contraseña que contenga como mínimo letras y números.  </h6>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button onClick={handleEmailSignUp}>Registrarme</button>
            <button id="btnVolver" onClick={onClose}>Volver</button>
            {showAlert && (
        <CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />
      )}
        </div>
        
    );
}

export default CrearCuenta;
