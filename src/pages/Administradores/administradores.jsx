import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./administradores.css";
import ModalA from "../../components/modal/modal";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare,faSquareXmark);

const data = [
  { cedula: 1, nombre: "Naruto", telefono: "5634565", correo: "kiuby@gmail.com", rol: "Admin" },
  { cedula: 2, nombre: "Goku", telefono: "563456523432", correo: "goku@gmail.com", rol: "Admin" },
  { cedula: 3, nombre: "Kenshin Himura", telefono: "75674" , correo: "x@gmail.com", rol: "Admin"},
  { cedula: 4, nombre: "Monkey D. Luffy", telefono: "3432", correo: "ReydelosPiratas@gmail.com", rol: "SuperAdmin" }
];

function Administradores() {
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] = useModal(false);
  const [dataState, setData] = useState(data);

  return (
    <Container>
      <br />
      <Button color="success">
        Crear
      </Button>
      <br />
      <br />
      <Table>
        <thead>
          <tr>
            <th>Cedula</th>
            <th>Nombre</th>
            <th>Telefono</th>
            <th>Coreo Electronico</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {dataState.map((dato) => (
            <tr key={dato.cedula}>
              <td>{dato.cedula}</td>
              <td>{dato.nombre}</td>
              <td>{dato.telefono}</td>
              <td>{dato.correo}</td>
              <td>{dato.rol}</td>
              <td>
                <Button onClick={openModalActualizar} color="primary">
                <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                </Button>
                <Button color="danger">
                <FontAwesomeIcon icon={faSquareXmark} size="lg" />
                </Button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalA isOpenA={isOpenActualizar} closeModal={closeModalActualizar} />
    </Container>
  );
}

export default Administradores;