import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import appHOT from "../../firebase/firebaseHOT";
import HomasLogo from "../../img/HomasLogo.png";
import CrearCuenta from "./crearCuenta";
import RecuperarContraseña from "./RecuperarContra";
import CustomAlert from "../../components/alert/alert";
import TopNavBar from "../../components/navbarC/navbar";


function Login() {
    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const [password, setPassword] = useState("");
    const [showRecuperarContraseña, setShowRecuperarContraseña] = useState(false);
    const [error, setError] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [textoAlert, setTextoAlert] = useState("");
    const [tipoAlert, setTipoAlert] = useState("");

    const handleLogin = () => {
        abrirAlertInicio()
        if (!email || !password) {
            setError("Por favor, complete todos los campos.");
            return;
        }
        const auth = getAuth(appHOT);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Inicio de sesión exitoso", user);
                
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
            }, 4000);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError("Credenciales inválidas. Por favor, inténtelo de nuevo.");
                console.error("Error en el inicio de sesión:", errorMessage);
            });

    };
/*
    const handleGoogleLogin = () => {
        abrirAlertInicio()
        const auth = getAuth(firebaseApp);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                setError("Error en el inicio de sesión con Google. Por favor, inténtelo de nuevo.");
                console.error("Error en el inicio de sesión con Google:", errorMessage);
            });
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
            }, 4000);
    };
*/
    const abrirAlertInicio = () => {
        setTextoAlert("Se ha iniciado sesión");
        setTipoAlert("success");
      };
    const handleRecuperarContraseñaClick = () => {
        setShowRecuperarContraseña(true);
    };

    useEffect(() => {
        localStorage.setItem("email", email);
    }, [email]);

    return (
        <div className="container">
            {!showRecuperarContraseña && (
                <div>
                    <h1>Inicio de Sesión</h1>
                    <div className="image-container">
                    <img id="logo" src={HomasLogo} />
                    </div>
                    <div className="container-correo">
                        <label className="objeto">Correo</label>
                        <input
                            placeholder="Ingrese su correo ..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="container-contraseña">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            placeholder="Ingrese su contraseña ..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}   
                        />
                    </div>
                    
                    {error && <p className="error-message">{error}</p>}
                    <div>
                        <button id="btnIniciar" onClick={handleLogin}>
                            Iniciar Sesión
                        </button>

                    </div>
                    <button id="btnRecuperarContraseña" onClick={handleRecuperarContraseñaClick}>
                        Recuperar Contraseña
                    </button>
                </div>
            )}
            {showRecuperarContraseña && (
                <RecuperarContraseña onClose={() => setShowRecuperarContraseña(false)} />
            )}
                  {showAlert && (
        <CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />
      )}
        </div>
    );
}

export default Login;
