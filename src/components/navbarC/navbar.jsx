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
            <Nav.Link className="navo" as={Link} to="/clientes">
              Clientes
            </Nav.Link>
            <Nav.Link className="navo" as={Link} to="/productos">
              Productos
            </Nav.Link>
            <Nav.Link className="navo" as={Link} to="/config">
              Perfil
            </Nav.Link>

            <Nav.Link className="navo" as={Link} to="/Facturacion">
              Facturación
            </Nav.Link>

            <Nav.Link className="navo" as={Link} to="/departamentos">
              Departamentos
            </Nav.Link>

            <Nav.Link className="navo" as={Link} to="/productos/Api">
              Target
            </Nav.Link>

            <Nav.Link className="navo" as={Link} to="/HistorialSalida">
              Movimientos
            </Nav.Link>
            <Nav.Link className="navo" as={Link} to="/historial">
              Historial Facturas
            </Nav.Link>
            <Nav.Link className="navo" as={Link} to="/pedidos">
              Pedidos
            </Nav.Link>
            <Nav.Link className="navo" as={Link} to="/Apartados">
              Apartados
            </Nav.Link>
            <Nav.Link className="navo" as={Link} to="/cortes">
              Cortes
            </Nav.Link>
        
          </Nav>
          <Nav.Link className="navo" as={Link} to="/">
            <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" id="iconoLogin" />
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavBar;