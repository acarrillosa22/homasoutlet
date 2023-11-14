import React, { useState } from 'react';
import { getFirestore, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import appHOT from '../../firebase/firebaseHOT';
import './Login.css';  
import HomasLogo from '../../img/HomasLogo.png';

const RecuperarContraseña = ({ onClose }) => {
  const [telefono, setTelefono] = useState('');
  const [cedula, setCedula] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [error, setError] = useState('');
  const [validacionExitosa, setValidacionExitosa] = useState(false);
  const [mostrarFormularioContraseña, setMostrarFormularioContraseña] = useState(false);
  const [contraseñaCambiada, setContraseñaCambiada] = useState(false);
  const [contraseñaAnterior, setContraseñaAnterior] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRecuperarContraseña = async () => {
    try {
      // Validación de campos obligatorios
      if (!telefono.trim() || !cedula.trim()) {
        setError('Por favor, complete todos los campos.');
        return;
      }

      const db = getFirestore(appHOT);
      const usuariosRef = collection(db, 'Usuarios');
      const usuariosSnapshot = await getDocs(usuariosRef);

      let encontrado = false;
      let contraseñaAnteriorUsuario = '';

      usuariosSnapshot.forEach((documento) => {
        try {
          const usuario = documento.data();

          if (usuario.telefono.trim() === telefono.trim() && usuario.cedula.trim() === cedula.trim()) {
            encontrado = true;
            contraseñaAnteriorUsuario = usuario.contraseña;
            return;
          }
        } catch (error) {
          console.error('Error al procesar documento:', error);
        }
      });

      if (encontrado) {
        setValidacionExitosa(true);
        setError('');
        setMostrarFormularioContraseña(true);
        setContraseñaAnterior(contraseñaAnteriorUsuario);
      } else {
        setError('No se encontró un usuario con los datos proporcionados.');
        setValidacionExitosa(false);
        setMostrarFormularioContraseña(false);
      }
    } catch (error) {
      console.error('Error al recuperar la contraseña:', error);
      setError('Error al recuperar la contraseña: ' + error.message);
      setValidacionExitosa(false);
      setMostrarFormularioContraseña(false);
    }
  };

  const handleGuardarContraseña = async () => {
    try {
      // Validación de campos obligatorios
      if (!nuevaContrasena.trim()) {
        setError('Por favor, ingrese una nueva contraseña.');
        return;
      }

      const db = getFirestore(appHOT);
      const usuariosRef = collection(db, 'Usuarios');

      // Realizar la consulta utilizando where
      const consulta = query(usuariosRef, where('telefono', '==', telefono.trim()), where('cedula', '==', cedula.trim()));
      const resultadoConsulta = await getDocs(consulta);

      if (resultadoConsulta.empty) {
        setError('No se encontró un usuario con los datos proporcionados.');
        setValidacionExitosa(false);
        setMostrarFormularioContraseña(false);
        return;
      }

      const documentoUsuario = resultadoConsulta.docs[0].ref;

      // Actualizar la contraseña en la base de datos
      await updateDoc(documentoUsuario, {
        contraseña: nuevaContrasena,
      });

      setContraseñaCambiada(true);
      setMostrarFormularioContraseña(false);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setError('Error al cambiar la contraseña: ' + error.message);
      setValidacionExitosa(false);
      setMostrarFormularioContraseña(false);
    }
  };

  return (
    <div className="container-Principal">
      <h1>Recuperar Contraseña</h1>
      <img id="logo" src={HomasLogo} alt="Logo" />
      <div className="container-correo">
        <label>Ingrese el teléfono que tiene registrado:</label>
        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </div>
      <div className="container-contraseña">
        <label>Ingrese la cédula que tiene registrada:</label>
        <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} />
        {error && <div className="alert error">{error}</div>}
        {validacionExitosa && !mostrarFormularioContraseña && <div className="alert success">Validación exitosa</div>}

        {mostrarFormularioContraseña && (
          <div>
            <label>Nueva Contraseña:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'text'}
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
              />
              <i
                className={`eye-icon ${showPassword ? 'visible' : 'hidden'}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            <p className="objeto">Contraseña anterior: {contraseñaAnterior}</p>
            <button id="btnRecuperarContraseña" onClick={handleGuardarContraseña}>
              Guardar Contraseña
            </button>
          </div>
        )}

        {contraseñaCambiada && <div className="alert success">Contraseña cambiada exitosamente</div>}

        {!mostrarFormularioContraseña && !contraseñaCambiada && (
          <div>
            <button id="btnRecuperar" onClick={handleRecuperarContraseña}>
              Recuperar Contraseña
            </button>
          </div>
        )}

        <button id="btnVolver" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default RecuperarContraseña;