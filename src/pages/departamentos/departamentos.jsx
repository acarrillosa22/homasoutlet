import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";

import ModalED from "../../components/modal-editar-departamentos/modal-editar-departamentos";
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
  { nombre: "Economia", estado: 1, descripcion: "Quieres volverte rico?"},
  { nombre: "Informatica", estado: 1, descripcion: "Otakus que no se bañanan"},
  { nombre: "Recursos humanos", estado: 1, descripcion: "Quejese aquí"},
  { nombre: "Sabeunacosa", estado: 1, descripcion: "Muy pronto va a venir CrIsTo y va a pegar la tierra"}
];

function Departamentos() {
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
            <th>Nombre</th>
            <th>Estado</th>
            <th>Descripción</th>
          </tr>
        </thead>

        <tbody>
          {dataState.map((dato) => (
            <tr key={dato.cedula}>
              <td>{dato.nombre}</td>
              <td>{dato.estado}</td>
              <td>{dato.descripcion}</td>
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

      <ModalED isOpenED={isOpenActualizar} closeModal={closeModalActualizar} />
    </Container>
  );
}

export default Departamentos;