import React, { useEffect, useState } from "react";
import "./tabla.css";
import { useModal } from "../../hooks/useModal";
import {Container } from "reactstrap";
import appPVH from "../../firebase/firebase";
import PrimerCorte from "./primerCorte";
import { getFirestore, collection, getDocs} from "firebase/firestore";
//-------------------------------------------------Imports Fontawesome---------------------------------------------------------------------
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretUp, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft, faCaretUp);

function CorteInicio() {
    const db = getFirestore(appPVH);
  const [usuarioC, setUsuarioC] = useState([]);
  const [cajasE, setCajaLista] = useState([]);
  const [isOpenCorteP, openModalCorteP,closeModalCorteP] = useModal(true);
  useEffect(() => {
    // Obtener datos de la memoria local al cargar el componente
    const perfilGuardado = localStorage.getItem("usuarioC");
    if (perfilGuardado) {
      const perfil = JSON.parse(perfilGuardado);
      setUsuarioC(perfil);
    }// Si es nulo o indefinido, asigna una cadena vacía
    obtenerCajas();
  }, []);

  const obtenerCajas = async () => {
    try {
      const userRef = collection(db, "Cajas");
      const userSnapshot = await getDocs(userRef);
      const all = userSnapshot.docs
        .map((departament) => departament.data())
        .filter((product) => product.EstadoCaja === "Activo");
      setCajaLista(all);
    } catch (error) {
      console.error("Error al obtener Producto: ", error);
    }
  };
  return (
    <Container>
      {openModalCorteP&&(
        <PrimerCorte
          isOpenA={isOpenCorteP}
          closeModal={closeModalCorteP}
          usuarioC={usuarioC.nombre}
          cajasLista={cajasE}
        />
      )}
    </Container>
  );
}
export default CorteInicio;
