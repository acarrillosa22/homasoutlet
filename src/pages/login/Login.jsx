import React, { useState } from "react";
import "./login.css";

function Login() {
  return (
    <div className="container">
      <h1>Inicio de Sesión</h1>
      <div className="image-container">
        <img src="logo.png" />
      </div>
      <div className="container-correo">
        <label className="objeto">Correo</label>
        <input placeholder="Ingrese su correo ..." />
      </div>
      <div className="container-contraseña">
        <label>Contraseña</label>
        <input placeholder="Ingrese su contraseña ..." />
      </div>
      <div>
        <button id="btnIniciar">Iniciar Sesión</button>
      </div>
      <button id="btnRecuperar">Recuperar Contraseña</button>
    </div>
  );
}

export default Login;
