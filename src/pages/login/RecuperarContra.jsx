import React, { useState } from "react";
import appHOT from "./firebaseHOTT";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "./Login.css";
import HomasLogo from "../../img/HomasLogo.png";

function RecuperarContraseña({ onClose }) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  function handlePasswordReset() {
    const auth = getAuth(appHOT);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Email de restablecimiento de contraseña enviado correctamente");
        setResetEmailSent(true);
        setErrorMessage(""); // Limpiar mensaje de error si había alguno
      })
      .catch((error) => {
        console.error("Error al enviar el correo electrónico de restablecimiento de contraseña", error);
        setErrorMessage("El correo ingresado no está registrado. Por favor, revíselo nuevamente.");
        setResetEmailSent(false); // Resetear el estado de resetEmailSent en caso de error
      });
  }

  return (
    <div className="container">
      <h1>Recuperar Contraseña</h1>
      <div className="image-container">
        <img src={HomasLogo} alt="Logo" />
      </div>
      <div className="container-correo">
        <label className="objeto">Correo</label>
        <input
          placeholder="Ingrese su correo ..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div id="botones">
        <button id="btnRecuperar" onClick={handlePasswordReset}>
          Recuperar Contraseña
        </button>
        <button id="btnVolver" onClick={onClose}>
          Volver
        </button>
      </div>
      {resetEmailSent && (
        <p>Email de restablecimiento de contraseña enviado correctamente</p>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default RecuperarContraseña;