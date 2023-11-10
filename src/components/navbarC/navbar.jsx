import Container from "react-bootstrap/Container";
import "./navbar.css";
import { Link } from "react-router-dom";
import HomasLogo from "../../img/HomasLogo.png";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons"; // Reemplaza con el ícono que quieras usar
library.add(faRightToBracket); // Agrega el ícono a la biblioteca

function TopNavBar() {
  const [isReadyForInstall, setIsReadyForInstall] = React.useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      // Prevent the mini-infobar from appearing on mobile.
      event.preventDefault();
      console.log("👍", "beforeinstallprompt", event);
      // Stash the event so it can be triggered later.
      window.deferredPrompt = event;
      // Remove the 'hidden' class from the install button container.
      setIsReadyForInstall(true);
    });
  }, []);

  async function downloadApp() {
    console.log("👍", "butInstall-clicked");
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      // The deferred prompt isn't available.
      console.log("oops, no prompt event guardado en window");
      return;
    }
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    const result = await promptEvent.userChoice;
    console.log("👍", "userChoice", result);
    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
    window.deferredPrompt = null;
    // Hide the install button.
    setIsReadyForInstall(false);
  }
  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      expand="lg"
      className="bg-body-tertiary"
    >
      <Container id="prueba">
        <img id="logo" src={HomasLogo} />
        <Navbar.Brand id="home" href="/Cierre">
          HOMAS outlet
        </Navbar.Brand>
        <Nav className="me-auto" variant="tabs" defaultActiveKey="/home">
          <Nav.Link className="navo" as={Link} to="/Ventas">
            Ventas
          </Nav.Link>
          <Nav.Link className="navo" as={Link} to="/clientes">
            Clientes
          </Nav.Link>
          <Nav.Link className="navo" as={Link} to="/productos">
            Productos
          </Nav.Link>
          <Nav.Link className="navo" as={Link} to="/config">
            Configuración
          </Nav.Link>

          <Nav.Link className="navo" as={Link} to="/departamentos">
            Departamentos
          </Nav.Link>

          <Nav.Link className="navo" as={Link} to="/productos/Api">
            Target
          </Nav.Link>

          <Nav.Link className="navo" as={Link} to="/Salidas">
            Movimientos
          </Nav.Link>
          <Nav.Link className="navo" as={Link} to="/obtenerFB">
            Factura Provisional
          </Nav.Link>
          <Nav.Link className="navo" as={Link} to="/pedidos">
            Pedidos
          </Nav.Link>
        </Nav>
        {isReadyForInstall && (
          <button onClick={downloadApp}> Escritorio </button>
        )}
        <Nav.Link className="navo" as={Link} to="/config">
          <FontAwesomeIcon
            icon="fa-solid fa-right-to-bracket"
            id="iconoLogin"
          />
        </Nav.Link>
      </Container>
    </Navbar>
  );
}
export default TopNavBar;
