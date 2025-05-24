import React, { useState, useEffect } from 'react';
import IP from '../Configuracion/Config';
import { NavLink } from 'react-router-dom';

export const Television = () =>{
    const [series, setSeries] = useState([]);

  useEffect(() => {
    fetchDataAndRenderList(`${IP}/series`, setSeries);
  }, []);

  function fetchDataAndRenderList(url, setState) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setState(data);
      })
      .catch(error => console.error('Error: ', error));
  }

  function renderSeriesList(series) {
    return series.map((serie, index) => (
      <div key={index} className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4">
        <div className="card">
          <NavLink to={`/detalles/${serie.id}/serie`} className="card-link">
            <img
              src={IP + '/imgServidor/' + serie.imgURL}
              className="card-img-top img-fluid"
              alt={serie.title}
            />
            <div className="card-body">
              <h5 className="card-title">{serie.title}</h5>
            </div>
          </NavLink>
        </div>
      </div>
    ));
  }

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <h2 className="text-center text-dark display-4 mb-5">Descubre nuestras Series</h2>
        <div className="row" id="seriesList">
          {renderSeriesList(series)}
        </div>
      </div>
    </div>
  );
}