import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Pagination } from 'react-bootstrap'; // Asegúrate de tener instalada esta librería
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faInfo, faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import IP from '../../Configuracion/Config';
import Select from 'react-select';


export const PeliculasTab = () => {
  const [peliculaId,setPeliculaId] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [detallesPelicula, setDetallesPelicula] = useState(null);
  const [peliculas, setPeliculas] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('id');


  const handleShowCrearModal = () => setShowCrearModal(true);
  const handleCloseCrearModal = () => setShowCrearModal(false);
  const handleShowEditarModal = () => setShowEditarModal(true);
  const handleCloseEditarModal = () => setShowEditarModal(false);

  const handleShowDetallesModal = (id) => {
    const peliculaSeleccionada = peliculas.find((pelicula) => pelicula.id === id);
    setDetallesPelicula(peliculaSeleccionada);
    setShowDetallesModal(true);
  };
  
  const handleCloseDetallesModal = () => setShowDetallesModal(false);

  useEffect(() => {
    fetch(`${IP}/peliculas`)
      .then(response => response.json())
      .then(data => {
        setPeliculas(data);
      })
      .catch(error => console.error('Error: ', error));

    fetch(`${IP}/personas`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((persona) => ({
          value: persona.id,
          label: persona.nombre,
        }));
        setPersonas(options);
      })
      .catch((error) => console.error('Error fetching actor data: ', error));
  }, []);

  const handleSort = (column) => {
    if (column === sortBy) {
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    year: '',
    duration: '',
    directors: [],
    actors: [],
    image: null,
    currentImgURL: '',
    destacada: false,
  });

  const [editFormData, setEditFormData] = useState({
    url: '',
    title: '',
    description: '',
    year: '',
    duration: '',
    directors: [],
    actors: [],
    image: null,
    currentImgURL: '',
    destacada: false,
  });

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta película?");

    if (confirmacion) {
      try {
        const response = await fetch(`${IP}/peliculas/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedPeliculas = await (await fetch(`${IP}/peliculas`)).json();
          setPeliculas(updatedPeliculas);
        } else {
          console.error('Error al eliminar la película:', response.statusText);
        }
      } catch (error) {
        console.error('Error al eliminar la película:', error.message);
      }
    }
  };

  const handleEditar = (id) => {
    setPeliculaId(id);
    const peliculaSeleccionada = peliculas.find((pelicula) => pelicula.id === id);
  
    setEditFormData({
      url: peliculaSeleccionada.url,
      title: peliculaSeleccionada.title,
      description: peliculaSeleccionada.description,
      destacada: peliculaSeleccionada.destacada,
      year: peliculaSeleccionada.year,
      duration: peliculaSeleccionada.duration,
      directors: peliculaSeleccionada.director.map((director) => ({
        value: director.id,
        label: director.nombre,
      })),
      actors: peliculaSeleccionada.cast.map((actor) => ({
        value: actor.id,
        label: actor.nombre,
      })),
      image: null,
      currentImgURL:`${IP}/imgServidor/${peliculaSeleccionada.imgURL}`,
    });
  
    handleShowEditarModal();
  };

  const handleCrear = async () => {
        try {
          const formDataToSend = new FormData();
          formDataToSend.append('url', formData.url);
          formDataToSend.append('title', formData.title);
          formDataToSend.append('description', formData.description);
          formDataToSend.append('destacada', formData.destacada);
          formDataToSend.append('year', formData.year);
          formDataToSend.append('duration', formData.duration);
          formDataToSend.append('image', formData.image);
      
          formData.actors.forEach(actor => formDataToSend.append('actors', actor.value));
          formData.directors.forEach(director => formDataToSend.append('directors', director.value));
      
          const response = await fetch(`${IP}/peliculas`, {
            method: 'POST',
            body: formDataToSend,
          });
      
          if (response.ok) {
            handleCloseCrearModal();
            const updatedPeliculas = await (await fetch(`${IP}/peliculas`)).json();
            setPeliculas(updatedPeliculas);
          } else {
            console.error('Error al crear la película:', response.statusText);
          }
        } catch (error) {
          console.error('Error al crear la película:', error.message);
        }
  };
  const handleGuardarCambios = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('url', editFormData.url);
      formDataToSend.append('title', editFormData.title);
      formDataToSend.append('description', editFormData.description);
      formDataToSend.append('destacada', editFormData.destacada);
      formDataToSend.append('year', editFormData.year);
      formDataToSend.append('duration', editFormData.duration);
      formDataToSend.append('image', editFormData.image);
  
      editFormData.actors.forEach(actor => formDataToSend.append('actors', actor.value));
      editFormData.directors.forEach(director => formDataToSend.append('directors', director.value));
      const response = await fetch(`${IP}/peliculas/${peliculaId}`, {
        method: 'PUT',
        body: formDataToSend,
      });
  
      if (response.ok) {
        handleCloseEditarModal();
        const updatedPeliculas = await (await fetch(`${IP}/peliculas`)).json();
        setPeliculas(updatedPeliculas);
      } else {
        console.error('Error al guardar cambios:', response.statusText);
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error.message);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditInputChange = (e, field) => {
    if (field === 'image') {
      const file = e.target.files[0];
      setEditFormData({
        ...editFormData,
        image: file,
        currentImgURL: URL.createObjectURL(file),
      });
    } else {
      const { value } = e.target;
      setEditFormData({
        ...editFormData,
        [field]: value,
      });
    }
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
      currentImgURL: URL.createObjectURL(file),
    });
  };
  const handleActorsChange = (selectedOptions) => {
    setFormData({
      ...formData,
      actors: selectedOptions,
    });
  };

  const handleDirectorsChange = (selectedOptions) => {
    setFormData({
      ...formData,
      directors: selectedOptions,
    });
  };

  const handleActorsEditChange = (selectedOptions) => {
    setEditFormData({
      ...editFormData,
      actors: selectedOptions,
    });
  };

  const handleDirectorsEditChange = (selectedOptions) => {
    setEditFormData({
      ...editFormData,
      directors: selectedOptions,
    });
  };


  const filterMovies = (pelicula, term) => {
    const normalizedTerm = term.toLowerCase();
    return (
      pelicula.title.toLowerCase().includes(normalizedTerm) ||
      pelicula.year.toString().includes(normalizedTerm) ||
      pelicula.duration.toString().includes(normalizedTerm)
    );
  };
  
  const filteredMovies = peliculas.filter((pelicula) =>
    filterMovies(pelicula, searchTerm)
  );

  const handleMoviesPerPageChange = (e) => {
    const newMoviesPerPage = parseInt(e.target.value, 10);
    setMoviesPerPage(newMoviesPerPage);
    setCurrentPage(1);
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid">
      <div className="container mt-5">
        <Button variant="primary" onClick={handleShowCrearModal}>
          <FontAwesomeIcon icon={faPlus} /> Crear Película
        </Button>
        <hr></hr>
        <div className="row">
           <div className="col-8">
              <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faSearch} />
              &nbsp;
              <Form.Control
                type="text"
                placeholder="Buscar película..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              </div>
          </div>
          <div className="col-4">
          <Form.Group controlId="moviesPerPageSelect">
            <Form.Control
              as="select"
              value={moviesPerPage}
              onChange={handleMoviesPerPageChange}
            >
              <option value={10}>10 peliculas por pagina</option>
              <option value={1}>1 pelicula por pagina</option>
              <option value={5}>5 peliculas por pagina</option>
              <option value={20}>20 peliculas por pagina</option>
            </Form.Control>
          </Form.Group>
          </div>        
        </div>
        <hr></hr>
        <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>
                ID{' '}
                {sortBy === 'id' && (
                  <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp : faArrowDown} />
                )}
              </th>
              <th>Imagen</th>
              <th onClick={() => handleSort('title')}>
                Titulo{' '}
                {sortBy === 'title' && (
                  <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp : faArrowDown} />
                )}
              </th>
              <th onClick={() => handleSort('year')}>
                Año de release{' '}
                {sortBy === 'year' && (
                  <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp : faArrowDown} />
                )}
              </th>
              <th onClick={() => handleSort('duration')}>
                Duracion (en minutos) {' '}
                {sortBy === 'duration' && (
                  <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp : faArrowDown} />
                )}
              </th>
              <th>Destacada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.sort((a, b) => {
              const multiplier = sortOrder === 'asc' ? 1 : -1;
              switch (sortBy) {
                case 'id':
                  return (a.id - b.id) * multiplier;
                case 'title':
                  return a.title.localeCompare(b.title) * multiplier;
                case 'year':
                  return (a.year - b.year) * multiplier;
                case 'duration':
                  return (a.duration - b.duration) * multiplier;
                default:
                  return 0;
              }
            }).slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage)
              .map((pelicula) => (
              <tr key={pelicula.id}>
                <td>{pelicula.id}</td>
                <td><img src={IP+'/imgServidor/'+pelicula.imgURL} className="thumbnail-image" alt={pelicula.title} /></td>
                <td>{pelicula.title}</td>
                <td>{pelicula.year}</td>
                <td>{pelicula.duration}</td>
                <td>{pelicula.destacada ? '⭐' : '❌'}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditar(pelicula.id)}>
                    <FontAwesomeIcon icon={faEdit} /> Editar
                  </Button>
                  &nbsp;
                  <Button variant="danger" onClick={() => handleEliminar(pelicula.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                  </Button>
                  &nbsp;
                  <Button variant="secondary" onClick={() => handleShowDetallesModal(pelicula.id)}>
                    <FontAwesomeIcon icon={faInfo} /> Detalles
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {Array.from({ length: Math.ceil(filteredMovies.length / moviesPerPage) }).map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                Page {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
        {/* Modal para Crear Película */}
        <Modal show={showCrearModal} onHide={handleCloseCrearModal}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Película</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group controlId="image">
                    <Form.Label>Imagen de la Película</Form.Label>
                    <hr></hr>
                    {formData.currentImgURL && (
                      <img src={formData.currentImgURL} alt="Current" className="thumbnail-image" />
                    )}
                    <hr></hr>
                    <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    isInvalid={!formData.image}
                    />
                    <Form.Control.Feedback type="invalid">
                    Ingrese una Imagen.
                    </Form.Control.Feedback>
                </Form.Group>
                &nbsp;
                <Form.Group controlId="url">
                    <Form.Label>URL</Form.Label>
                    <Form.Control
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    isInvalid={!isValidURL(formData.url)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Ingrese una URL válida.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="title">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    isInvalid={!formData.title.trim()}
                      />
                    <Form.Control.Feedback type="invalid">
                      Ingrese un Titulo válido.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        isInvalid={!formData.description.trim()}
                      />
                    <Form.Control.Feedback type="invalid">
                      Ingrese una descripción válida.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="year">
                    <Form.Label>Año de Release</Form.Label>
                    <Form.Control
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        isInvalid={isNaN(formData.year) || formData.year < 1900}
                    />
                    <Form.Control.Feedback type="invalid">
                     {isNaN(formData.year) ? 'Ingrese un año válido.' : 'Año debe ser mayor o igual a 1900.'}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="duration">
                    <Form.Label>Duración</Form.Label>
                    <Form.Control
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        isInvalid={isNaN(formData.duration) || formData.duration <= 0}
                    />
                    <Form.Control.Feedback type="invalid">
                      {isNaN(formData.duration) ? 'Ingrese una duración válida.' : 'La duración debe ser mayor a 0.'}
                    </Form.Control.Feedback>
                </Form.Group>
                &nbsp;
                <Form.Group controlId="actors">
                    <Form.Label>Actores</Form.Label>
                    <Select
                    isMulti
                    options={personas}
                    value={formData.actors}
                    onChange={handleActorsChange}
                    isInvalid={formData.actors.length<=0}
                    />
                    <Form.Control.Feedback type="invalid">
                      Seleccione al menos un actor.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="directors">
                    <Form.Label>Directores</Form.Label>
                    <Select
                    isMulti
                    options={personas}
                    value={formData.directors}
                    onChange={handleDirectorsChange}
                    isInvalid={formData.directors.length<= 0}
                    />
                      <Form.Control.Feedback type="invalid">
                        Seleccione al menos un director.
                      </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="destacada">
                  <Form.Check
                    type="checkbox"
                    label="Destacada"
                    checked={formData.destacada}
                    onChange={() => setFormData({ ...formData, destacada: !formData.destacada })}
                  />
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            onClick={handleCrear}
            disabled={
              !formData.image ||
              formData.actors.length === 0 ||
              !formData.directors ||
              formData.directors.length === 0 ||
              !isValidURL(formData.url) ||
              formData.title.trim() === '' ||
              formData.description.trim() === '' ||
              isNaN(formData.year) || formData.year < 1900 ||
              isNaN(formData.duration) || formData.duration <= 0
            }
          >
            Crear Película
          </Button>
            <Button variant="secondary" onClick={handleCloseCrearModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para Editar Película */}
        <Modal show={showEditarModal} onHide={handleCloseEditarModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Película</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            <Form.Group controlId="image">
              <Form.Label>Cambiar la imagen</Form.Label>
              <hr></hr>
              {editFormData.currentImgURL && (
                <img src={editFormData.currentImgURL} alt="Current" className="thumbnail-image" />
              )}
              <hr></hr>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleEditInputChange(e, 'image')}
                isInvalid={!editFormData.image && !editFormData.currentImgURL}
                />
                <Form.Control.Feedback type="invalid">
                Ingrese una Imagen.
                </Form.Control.Feedback>
            </Form.Group>
            &nbsp;
            <Form.Group controlId="url">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                name="url"
                value={editFormData.url}
                onChange={(e) => handleEditInputChange(e, 'url')}
                isInvalid={!isValidURL(editFormData.url)}
                />
                <Form.Control.Feedback type="invalid">
                  Ingrese una URL válida.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="title">
              <Form.Label>Título</Form.Label>
              <Form.Control
              type="text"
              name="title"
              value={editFormData.title}
              onChange={(e) => handleEditInputChange(e, 'title')}
              isInvalid={!editFormData.title.trim()}
                      />
                <Form.Control.Feedback type="invalid">
                      Ingrese un Titulo válido.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={editFormData.description}
              onChange={(e) => handleEditInputChange(e, 'description')}
              isInvalid={!editFormData.description.trim()}
              />
              <Form.Control.Feedback type="invalid">
                Ingrese una descripción válida.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="year">
              <Form.Label>Año de Release</Form.Label>
              <Form.Control
              type="number"
              name="year"
              value={editFormData.year}
              onChange={(e) => handleEditInputChange(e, 'year')}
              isInvalid={isNaN(editFormData.year) || editFormData.year < 1900}
                    />
              <Form.Control.Feedback type="invalid">
                     {isNaN(editFormData.year) ? 'Ingrese un año válido.' : 'Año debe ser mayor o igual a 1900.'}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="duration">
              <Form.Label>Duración</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={editFormData.duration}
                onChange={(e) => handleEditInputChange(e, 'duration')}
                isInvalid={isNaN(editFormData.duration) || editFormData.duration <= 0}
                    />
                <Form.Control.Feedback type="invalid">
                      {isNaN(editFormData.duration) ? 'Ingrese una duración válida.' : 'La duración debe ser mayor a 0.'}
                </Form.Control.Feedback>
            </Form.Group>
                &nbsp;
            <Form.Group controlId="actors">
              <Form.Label>Actores</Form.Label>
              <Select
              isMulti
              options={personas}
              value={editFormData.actors}
              onChange={handleActorsEditChange}
              isInvalid={editFormData.actors.length<=0}
                    />
              <Form.Control.Feedback type="invalid">
                      Seleccione al menos un actor.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="directors">
              <Form.Label>Directores</Form.Label>
              <Select
              isMulti
              options={personas}
              value={editFormData.directors}
              onChange={handleDirectorsEditChange}
              isInvalid={editFormData.directors.length<= 0}
                    />
              <Form.Control.Feedback type="invalid">
                Seleccione al menos un director.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="destacada">
                  <Form.Check
                    type="checkbox"
                    label="Destacada"
                    checked={editFormData.destacada}
                    onChange={() => setEditFormData({ ...editFormData, destacada: !editFormData.destacada })}
                  />
            </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
            variant="primary"
            type="submit"
            onClick={handleGuardarCambios}
            disabled={
              (!editFormData.image && !editFormData.currentImgURL) ||
              editFormData.actors.length === 0 ||
              !editFormData.directors ||
              editFormData.directors.length === 0 ||
              !isValidURL(editFormData.url) ||
              editFormData.title.trim() === '' ||
              editFormData.description.trim() === '' ||
              isNaN(editFormData.year) || editFormData.year < 1900 ||
              isNaN(editFormData.duration) || editFormData.duration <= 0
            }
          >
            Guardar Cambios
          </Button>
            <Button variant="secondary" onClick={handleCloseEditarModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal para Detalles Película */}
        <Modal show={showDetallesModal} onHide={handleCloseDetallesModal}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles de Película</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detallesPelicula && (
              <div>
                <p>ID: {detallesPelicula.id}</p>
                <p>Imagen: <img src={IP+'/imgServidor/'+detallesPelicula.imgURL} className="thumbnail-image" alt={detallesPelicula.title} /></p>
                <p>Título: {detallesPelicula.title}</p>
                <p>Año de Release: {detallesPelicula.year}</p>
                <p>Duración: {detallesPelicula.duration}</p>
                <p>Descripción: {detallesPelicula.description}</p>

                {detallesPelicula.cast && detallesPelicula.cast.length > 0 && (
                  <div>
                    <h5>Actores:</h5>
                    <ul>
                      {detallesPelicula.cast.map((actor) => (
                        <li key={actor.id}>
                          <img src={`${IP}/imgServidor/${actor.imgURL}`} className="thumbnail-image" alt={actor.nombre} />
                          {actor.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detallesPelicula.director && detallesPelicula.director.length > 0 && (
                  <div>
                    <h5>Directores:</h5>
                    <ul>
                      {detallesPelicula.director.map((director) => (
                        <li key={director.id}>
                          <img src={`${IP}/imgServidor/${director.imgURL}`} className="thumbnail-image" alt={director.nombre} />
                          {director.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDetallesModal}>
                    Cerrar
              </Button>
          </Modal.Footer>
      </Modal>
      </div>
    </div>
  );
};
