import React, { useState, useEffect } from 'react';
import IP from '../Configuracion/Config';
import { NavLink } from 'react-router-dom';

export const Recomendaciones = () =>{
    const [destacados, setdestacados] = useState([]);

  useEffect(() => {
    fetch(`${IP}/destacados`)
      .then(response => response.json())
      .then(data => setdestacados(data))
      .catch(error => console.error('Error fetching Destacados: ', error));
  }, []);

  const renderDestacados = () => {
    return destacados.map((destacado, index) => (
      <div key={index} className="col-sm-6 col-md-4 col-lg-3">
        <div className="card mb-4 shadow-sm">
          <NavLink to={`/detalles/${destacado.id}/destacado`} className="card-link">
            <img src={IP + '/imgServidor/' + destacado.imgURL} className="card-img-top img-fluid" alt={destacado.title} />
            <div className="card-body">
              <h5 className="card-title">{destacado.title}</h5>
            </div>
          </NavLink>
        </div>
      </div>
    ));
  };

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <h2 className="text-center text-dark display-4 mb-5">Descubre nuestras Recomendaciones</h2>
        <div className="row" id="destacadosList">
          {renderDestacados()}
        </div>
      </div>
    </div>
  );
}