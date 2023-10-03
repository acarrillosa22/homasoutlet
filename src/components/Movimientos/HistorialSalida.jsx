import React, { useState } from "react";
import "./HistorialSalida.css";

const HistorialSalida = ({
  historial = [],
  onBackClick,
}) => {
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroMonto, setFiltroMonto] = useState("");

  const handleFiltroTipoChange = (event) => {
    setFiltroTipo(event.target.value);
  };

  const handleFiltroFechaChange = (event) => {
    setFiltroFecha(event.target.value);
  };

  const handleFiltroMontoChange = (event) => {
    setFiltroMonto(event.target.value);
  };

  const filteredHistorial = historial.filter((registro) => {
    const tipoMatch = registro.Tipo.toLowerCase().includes(filtroTipo.toLowerCase());
    const fechaMatch = registro.Fecha.toLowerCase().includes(filtroFecha.toLowerCase());
    const montoMatch = registro.Monto.toString().toLowerCase().includes(filtroMonto.toLowerCase());

    return tipoMatch && fechaMatch && montoMatch;
  });

  return (
    <div>
      <div className="filtros">
        <div>
          <label>Filtrar por Tipo:</label>
          <input
            type="text"
            value={filtroTipo}
            onChange={handleFiltroTipoChange}
          />
        </div>
        <div>
          <label>Filtrar por Monto:</label>
          <input
            type="text"
            value={filtroMonto}
            onChange={handleFiltroMontoChange}
          />
        </div>
        <div>
          <label>Filtrar por Fecha:</label>
          <input
            type="text"
            value={filtroFecha}
            onChange={handleFiltroFechaChange}
          />
        </div>
      </div>
      <div className="tabla-historial">
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Motivo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistorial.map((registro, index) => (
              <tr key={index}>
                <td>{registro.Tipo}</td>
                <td>{registro.Monto}</td>
                <td>{registro.Motivo}</td>
                <td>{registro.Fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialSalida;