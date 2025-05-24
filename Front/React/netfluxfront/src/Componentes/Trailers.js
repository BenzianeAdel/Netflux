import React, { useState, useEffect } from 'react';
import IP from '../Configuracion/Config';
import { NavLink } from 'react-router-dom';

export const Trailers = () =>{
    const [trailers, settrailers] = useState([]);

  useEffect(() => {
    fetch(`${IP}/trailers`)
      .then(response => response.json())
      .then(data => settrailers(data))
      .catch(error => console.error('Error fetching Trailers: ', error));
  }, []);

  const renderTrailers = () => {
    return trailers.map((trailer, index) => (
      <div key={index} className="col-sm-6 col-md-4 col-lg-3">
        <div className="card mb-4 shadow-sm">
          <NavLink to={`/detalles/${trailer.id}/trailer`} className="card-link">
            <img src={IP + '/imgServidor/' + trailer.imgURL} className="card-img-top img-fluid" alt={trailer.title} />
            <div className="card-body">
              <h5 className="card-title">{trailer.title}</h5>
            </div>
          </NavLink>
        </div>
      </div>
    ));
  };

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <h2 className="text-center text-dark display-4 mb-5">Descubre nuestros Trailers</h2>
        <div className="row" id="trailersList">
          {renderTrailers()}
        </div>
      </div>
    </div>
  );
}