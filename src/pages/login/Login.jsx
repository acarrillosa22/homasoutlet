import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';
import appHOT from '../../firebase/firebaseHOT';
import HomasLogo from '../../img/HomasLogo.png';
import './login.css';
import RecuperarContraseña from './RecuperarContra';

const Usuarios = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState('');
  const [tipoAlert, setTipoAlert] = useState('');
  const [showRecuperarContraseña, setShowRecuperarContraseña] = useState(false);
  
  useEffect(() => {
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const db = getFirestore(appHOT);
      const usuariosRef = collection(db, 'Usuarios');
      const q = query(usuariosRef);

      let credencialesCorrectas = false;
      let rolUsuario = '';

      const usuariosSnapshot = await getDocs(q);

      usuariosSnapshot.forEach((doc) => {
        const usuario = doc.data();

        if (usuario.correoElectronico === email && usuario.contraseña === password) {
          credencialesCorrectas = true;
          rolUsuario = usuario.rol; // Obtener el rol del usuario
        }
      });

      if (credencialesCorrectas) {
        abrirAlertInicio();

        // Validar el rol y redirigir según el caso
        if (rolUsuario === 'Cliente') {
            setTextoAlert('Lo siento, usted NO tiene permisos para ingresar.');
            setTipoAlert('error');
            setShowAlert(true);
        } else if (rolUsuario === 'Admin') {
          //  <Redirect to="/ruta-a" />
        } else if (rolUsuario === 'SuperAdmin') {
          //<Redirect to="/ruta-b" />
        }
      } else {
        // Validar campos vacíos
        if (!email || !password) {
          setTextoAlert('Por favor, complete todos los campos.');
          setTipoAlert('error');
        } else {
          // Validar correo incorrecto
          setTextoAlert('Correo electrónico o contraseña incorrectos. Por favor, inténtelo de nuevo.');
          setTipoAlert('error');
        }
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 4000);
      }
    } catch (error) {
      setTextoAlert('Error al iniciar sesión: ' + error.message);
      setTipoAlert('error');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
    }
  };

  const abrirAlertInicio = () => {
    setTextoAlert('Se ha iniciado sesión');
    setTipoAlert('success');
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };
  const handleRecuperarContraseñaClick = () => {
    setShowRecuperarContraseña(true);
  };

  const handleCloseRecuperarContraseña = () => {
    setShowRecuperarContraseña(false);
  };

  return (
    <div className="container-Principal">
      {showRecuperarContraseña ? (
        <div className="modal-overlay">
          <div className="modal-container">
            <RecuperarContraseña onClose={handleCloseRecuperarContraseña} />
          </div>
        </div>
      ) : (
        <>
          <h1>Inicio de Sesión</h1>
          <div className="logo">
            <img id="logo" src={HomasLogo} alt="Logo" />
          </div>
          <form onSubmit={handleLogin}>
            <div className="container-correo">
              <label className="objeto">Correo</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="container-contraseña">
              <label>Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button id="btnIniciar" type="submit">
              Iniciar Sesión
            </button>
            <button id="btnRecuperarContraseña" onClick={handleRecuperarContraseñaClick}>
              Recuperar Contraseña
            </button>
          </form>
          {showAlert && <div className={`alert ${tipoAlert}`}>{textoAlert}</div>}
        </>
      )}
    </div>
  );
};

export default Usuarios;