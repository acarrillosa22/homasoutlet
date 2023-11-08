import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import HomasLogo from "../../img/HomasLogo.png";
import "./navbar.css";

library.add(faRightToBracket);

function TopNavBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary" collapseOnSelect>
      <Container id="prueba">
        <Navbar.Brand id="home" as={Link} to="/Cierre">
          <img id="logo" src={HomasLogo} alt="Homas Logo" />
          HOMAS outlet
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
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
          </Nav>
          <NavDropdown title="Configuración" id="collasible-nav-dropdown">
            <NavDropdown.Item as={Link} to="/config">
              Opción 1
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link className="navo" as={Link} to="/config">
            <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" id="iconoLogin" />
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavBar;