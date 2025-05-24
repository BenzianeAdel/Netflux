import React, { useState, useEffect } from 'react';
import IP from '../Configuracion/Config';
import { NavLink } from 'react-router-dom';

export const Inicio = () =>{
  const [nuevasPeliculas, setNuevasPeliculas] = useState([]);
  const [nuevasSeries, setNuevasSeries] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    fetchDataAndRenderList(`${IP}/peliculas/novedades`, setNuevasPeliculas);
    fetchDataAndRenderList(`${IP}/series/novedades`, setNuevasSeries);
    fetchDataAndRenderList(`${IP}/destacados`, setDestacados);
    fetchDataAndRenderList(`${IP}/trailers`, setTrailers);
  }, []);

  function fetchDataAndRenderList(url, setState) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setState(data);
      })
      .catch(error => console.error('Error: ', error));
  }

  function construirURL(type){
    let tipoContenido;

    if (type === 'trailer') {
      tipoContenido = 'trailer';
    } else if (type === 'serie') {
      tipoContenido = 'serie';
    } else {
      tipoContenido = 'pelicula';
    }
    return tipoContenido;
  }

  function renderList(list, type) {
    let columnClasses = "";
  
    if (type === "pelicula" || type === "serie") {
      columnClasses = "col-sm-12 col-md-6 col-lg-3 col-xl-3";
    }
  
    return list.map((item, index) => (
      <li key={index} className={`list-group-item ${columnClasses}`}>
        <div className="card">
        <NavLink to={`/detalles/${item.id}/${type === 'destacado' ? item.type : construirURL(type)}`} className="card-link">
        <img src={IP+'/imgServidor/'+item.imgURL} className="card-img-top img-fluid" alt={item.title} />
          <div className="card-body">
            <h5 className="card-title">{item.title}</h5>
          </div>
        </NavLink>
        </div>
      </li>
    ));
  }

  return (
    <div className="container-fluid">
      <div className="container mt-5">
        <p className="descripcionCatalogo">
          El catálogo de NetFlux es un tesoro de entretenimiento que brinda la oportunidad de explorar, descubrir y disfrutar de un sinfín de historias, todo ello desde la comodidad de tu hogar. Ya seas un adicto al cine, un amante de las series, o un ávido documentalista, NetFlux tiene algo que te atrapará y te llevará en un viaje inolvidable a través del mundo del entretenimiento.
        </p>

        <div className="row">
          <div className="col-sm-12 col-lg-9 col-xl-9 col-md-12">
            <h2 className="nameColor">Nuevas películas</h2>
            <div className="row" id="nuevasPeliculasList">
              {renderList(nuevasPeliculas,'pelicula')}
            </div>
            <div className="col-sm-12 col-md-12 col-lg-9 col-xl-9">
              <hr className="separador" />
            </div>
            <h2 className="nameColor">Nuevas series</h2>
            <div className="row" id="nuevasSeriesList">
              {renderList(nuevasSeries,'serie')}
            </div>
          </div>
          <div className="col-sm-12 col-lg-3 col-xl-3 col-md-12">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h3 className="nameColor">Destacados</h3>
              <ul className="list-group" id="destacadosList">
                {renderList(destacados,'destacado')}
              </ul>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <hr className="separador" />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h3 className="nameColor">Trailers Nuevos</h3>
              <ul className="list-group" id="trailersList">
                {renderList(trailers, 'trailer')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}