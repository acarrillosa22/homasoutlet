
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./administradores.css";
import ModalA from "../../components/modal/modal";
import React from "react";
import "./administradores.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons"; // Reemplaza con el ícono que quieras usar
library.add(faRightToBracket); // Agrega el ícono a la biblioteca
const data = [
  { id: 1, personaje: "Naruto", anime: "Naruto" },
  { id: 2, personaje: "Goku", anime: "Dragon Ball" },
  { id: 3, personaje: "Kenshin Himura", anime: "Rurouni Kenshin" },
  { id: 4, personaje: "Monkey D. Luffy", anime: "One Piece" },
  {
    id: 5,
    personaje: "Edward Elric",
    anime: "Fullmetal Alchemist: Brotherhood",
  },
  { id: 6, personaje: "Seto Kaiba", anime: "Yu-Gi-Oh!" },
];
function administradores() {
  state = {
    data: data,
    form: {
      id: "",
      personaje: "",
      anime: "",
    },
  };

  editar = (dato) => {
    var contador = 0;
    var arreglo = this.state.data;
    arreglo.map((registro) => {
      if (dato.id == registro.id) {
        arreglo[contador].personaje = dato.personaje;
        arreglo[contador].anime = dato.anime;
      }
      contador++;
    });
    this.setState({ data: arreglo, modalActualizar: false });
  };

  eliminar = (dato) => {
    var opcion = window.confirm(
      "Estás Seguro que deseas Eliminar el elemento " + dato.id
    );
    if (opcion == true) {
      var contador = 0;
      var arreglo = this.state.data;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      this.setState({ data: arreglo, modalActualizar: false });
    }
  };

  insertar = () => {
    var valorNuevo = { ...this.state.form };
    valorNuevo.id = this.state.data.length + 1;
    var lista = this.state.data;
    lista.push(valorNuevo);
    this.setState({ modalInsertar: false, data: lista });
  };

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };
  return (
    <Container>
      <br />
      <Button color="success" >
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
                

          {this.state.data.map((dato) => (
            <tr key={dato.id}>
              <td>{dato.id}</td>
              <td>{dato.personaje}</td>
              <td>{dato.anime}</td>
              <td>
                <Button
                  color="primary"
                  onClick={() => this.mostrarModalActualizar(dato)}
                >
                  Editar
                </Button>{" "}
                <Button color="danger" onClick={() => this.eliminar(dato)}>
                  Eliminar
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

