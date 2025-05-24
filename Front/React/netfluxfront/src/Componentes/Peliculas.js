import React, { useState, useEffect } from 'react';
import IP from '../Configuracion/Config';
import { NavLink } from 'react-router-dom';

export const Peliculas = () =>{
    const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    fetch(`${IP}/peliculas`)
      .then(response => response.json())
      .then(data => setPeliculas(data))
      .catch(error => console.error('Error fetching movies: ', error));
  }, []);

  const renderMovies = () => {
    return peliculas.map((pelicula, index) => (
      <div key={index} className="col-sm-6 col-md-4 col-lg-3">
        <div className="card mb-4 shadow-sm">
          <NavLink to={`/detalles/${pelicula.id}/pelicula`} className="card-link">
            <img src={IP + '/imgServidor/' + pelicula.imgURL} className="card-img-top img-fluid" alt={pelicula.title} />
            <div className="card-body">
              <h5 className="card-title">{pelicula.title}</h5>
            </div>
          </NavLink>
        </div>
      </div>
    ));
  };

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <h2 className="text-center text-dark display-4 mb-5">Descubre nuestras Películas</h2>
        <div className="row" id="peliculasList">
          {renderMovies()}
        </div>
      </div>
    </div>
  );
}