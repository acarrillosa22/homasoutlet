import Container from "react-bootstrap/Container";
import "./navbar.css";
import { Link } from "react-router-dom";
import HomasLogo from "../../img/HomasLogo.png";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons"; // Reemplaza con el ícono que quieras usar
library.add(faRightToBracket); // Agrega el ícono a la biblioteca

function TopNavBar() {
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
          <Nav.Link className="navo" as={Link} to="/inventario">
            Inventario
          </Nav.Link>
          <Nav.Link className="navo" as={Link} to="/config">
            Configuración
          </Nav.Link>

          <Nav.Link className="navo" as={Link} to="/departamentos">
            departamentos
          </Nav.Link>

          <Nav.Link className="navo" as={Link} to="/productos/Api">
            Target
          </Nav.Link>
        </Nav>
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
