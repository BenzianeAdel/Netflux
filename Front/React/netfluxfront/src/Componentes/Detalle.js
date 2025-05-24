import React, { useState, useEffect } from 'react';
import IP from '../Configuracion/Config';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export const Detalle = () =>{
  const{id,type} = useParams();
  const [detalles, setDetalles] = useState({});
  const [destacados, setDestacados] = useState([]);
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;
        if (type === 'pelicula') {
          url = `${IP}/peliculas/${id}`;
        } else if(type==='serie'){
          url = `${IP}/series/${id}`;
        } else{
          url = `${IP}/trailers/${id}`;
        }

        const detallesResponse = await fetch(url);
        const detallesData = await detallesResponse.json();
        setDetalles(detallesData);
        const destacadosResponse = await fetch(`${IP}/destacados`);
        const destacadosData = await destacadosResponse.json();
        setDestacados(destacadosData);

        const trailersResponse = await fetch(`${IP}/trailers`);
        const trailersData = await trailersResponse.json();
        setTrailers(trailersData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [id, type]);



  function renderList(list, type) {
  
    return list.map((item, index) => (
      <li key={index} className={`list-group-item`}>
        <div className="card">
        <NavLink to={`/detalles/${item.id}/${type === 'destacado' ? item.type : 'trailer'}`} className="card-link">
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
        <hr></hr>
      <div className="jumbotron text-center">
            <h1 className="display-4">{detalles?.title}</h1>
            {(detalles?.year !== undefined || detalles?.yearStart !== undefined) ? <p><strong>Año: </strong>{detalles?.year}{detalles?.yearStart}</p>
            : <></> 
            }
            
            <NavLink className="btn btn-primary btn-lg" to={detalles?.url} role="button">Ver en Netflux</NavLink>
        </div>
      <div className="row">
            <div className="col-sm-12 col-lg-9 col-xl-9 col-md-12">
                <div className="row">
                    <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 nuevas-peliculas">
                    <img
                        src={detalles?.imgURL ? `${IP}/imgServidor/${detalles.imgURL}` : 'IMAGEN NO DISPONIBLE'}
                        className="img-fluid"
                        alt="imagen"
                    />
                    </div>
                    <div className="col-sm-8 col-md-8 col-lg-8 col-xl-8 nuevas-peliculas">
                    <h5 className="card-title">
                        {detalles?.title +
                          (detalles?.year !== undefined
                            ? ` (${detalles?.year})`
                            : detalles?.yearStart !== undefined
                            ? ` (${detalles?.yearStart})`
                            : ``)}
                      </h5>
                        <p className="card-text">{detalles?.description}</p>
                          {detalles?.duration !== undefined ? (
                            <>
                            <p><strong>Duración (en minutos): </strong> {detalles?.duration}</p>
                            </>
                          ) : detalles?.creators !== undefined ? (
                              <>
                                  <p><strong>Año de inicio:</strong> {detalles?.yearStart}</p>
                                  <p><strong>Año de fin:</strong> {detalles?.yearEnd === 0 ? 'No ha acabado aún' : detalles?.yearEnd}</p>
                                  <p><strong>Temporadas: </strong>{detalles?.seasons}</p>
                              </>
                          ):(
                            <>
                            </>
                          )}
                    </div>
                </div>
                {detalles?.director !== undefined ? (
                            <>
                           <div className="row">
                            <div className="col-12">
                            <h5>Directores:</h5>
                              <div className="creador-card">
                                        <div className="row">
                                            {detalles?.director?.map((director, index) => (
                                              <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
                                                <NavLink to={`https://www.google.com/search?q=${encodeURIComponent(director.nombre)}`} target="_blank" className="creador-link">
                                                  <img src={IP+'/imgServidor/'+director.imgURL} alt={director.nombre} className="creador-img" />
                                                      <span className="creador-name">{director.nombre}</span>
                                                </NavLink>
                                              </div>
                                            ))}
                                        </div>
                                </div>
                            </div>
                              </div>
                            </>
                          ) : detalles?.creators !== undefined ? (
                              <>
                              <div className="row">
                              <div className="col-12">
                              <h5>Creadores:</h5>
                              <div className="creador-card">
                                          <div className="row">
                                              {detalles?.creators?.map((actor, index) => (
                                                <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
                                                  <NavLink to={`https://www.google.com/search?q=${encodeURIComponent(actor.nombre)}`} target="_blank" className="creador-link">
                                                    <img src={IP+'/imgServidor/'+actor.imgURL} alt={actor.nombre} className="creador-img" />
                                                        <span className="creador-name">{actor.nombre}</span>
                                                  </NavLink>
                                                </div>
                                              ))}
                                          </div>
                                  </div>
                              </div>
                              </div>
                              </>
                ):(
                  <>
                  </>
                )}
                
                <div className="row">
                  <div className="col-12">
                      <h5>Reparto:</h5>
                      <div className="actor-card">
                          <div className="row">
                              {detalles?.cast?.map((actor, index) => (
                                  <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
                                      <NavLink to={`https://www.google.com/search?q=${encodeURIComponent(actor.nombre)}`} target="_blank" className="actor-link">
                                          <img src={IP+'/imgServidor/'+actor.imgURL} alt={actor.nombre} className="actor-img" />
                                          <span className="actor-name">{actor.nombre}</span>
                                      </NavLink>
                                  </div>
                              ))}
                          </div>
                      </div>
                    </div>
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
      &nbsp;
    </div>
  );
}