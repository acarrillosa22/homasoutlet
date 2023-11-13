import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import CustomAlert from "../../components/alert/alert";

function RecuperarContraseña({ onClose }) {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [textoAlert, setTextoAlert] = useState("");
    const [tipoAlert, setTipoAlert] = useState("");

    const abrirAlertContra = () => {
        setTextoAlert("Se ha cambiado enviado su correo de restablecimiento");
        setTipoAlert("success");
      };


    const handlePasswordReset = () => {
        abrirAlertContra()
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("Email de restablecimiento de contraseña enviado correctamente");
                setResetEmailSent(true);
                setShowAlert(true);
                setTimeout(() => {
                  setShowAlert(false);
                }, 4000);
            })
            .catch((error) => {
                console.error("Error al enviar el correo electrónico de restablecimiento de contraseña", error);
                setErrorMessage("Error al enviar el correo electrónico de restablecimiento de contraseña. Por favor, inténtelo de nuevo más tarde.");
            });

    };

    return (
        <div className="container">
            <h1>Recuperar Contraseña</h1>
            <div className="image-container">
                <img src="logo.png" alt="Logo" />
            </div>
            <div className="container-correo">
                <label className="objeto">Correo</label>
                <input
                    placeholder="Ingrese su correo ..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button id="btnRecuperar" onClick={handlePasswordReset}>
                Recuperar Contraseña
            </button>
            {resetEmailSent && <p>Email de restablecimiento de contraseña enviado correctamente</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button id="btnVolver" onClick={onClose}>Volver</button>
    {showAlert && (
        <CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />
      )}
        </div>
    );
}

export default RecuperarContraseña;
