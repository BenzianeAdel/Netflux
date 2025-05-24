import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Pagination } from 'react-bootstrap'; // Asegúrate de tener instalada esta librería
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faInfo, faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import IP from '../../Configuracion/Config';
import Select from 'react-select';

export const TrailersTab = () =>{
  const [trailerId,settrailerId] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [detallestrailer, setDetallestrailer] = useState(null);
  const [trailers, settrailers] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [trailersPerPage, settrailersPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('id');


  const handleShowCrearModal = () => setShowCrearModal(true);
  const handleCloseCrearModal = () => setShowCrearModal(false);
  const handleShowEditarModal = () => setShowEditarModal(true);
  const handleCloseEditarModal = () => setShowEditarModal(false);

  const handleShowDetallesModal = (id) => {
    const trailerSeleccionada = trailers.find((trailer) => trailer.id === id);
    setDetallestrailer(trailerSeleccionada);
    setShowDetallesModal(true);
  };
  
  const handleCloseDetallesModal = () => setShowDetallesModal(false);

  useEffect(() => {
    fetch(`${IP}/trailers`)
      .then(response => response.json())
      .then(data => {
        settrailers(data);
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
    directors: [],
    actors: [],
    image: null,
    currentImgURL: '',
  });

  const [editFormData, setEditFormData] = useState({
    url: '',
    title: '',
    description: '',
    directors: [],
    actors: [],
    image: null,
    currentImgURL: '',
  });

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este trailer?");

    if (confirmacion) {
      try {
        const response = await fetch(`${IP}/trailers/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedtrailers = await (await fetch(`${IP}/trailers`)).json();
          settrailers(updatedtrailers);
        } else {
          console.error('Error al eliminar el trailer:', response.statusText);
        }
      } catch (error) {
        console.error('Error al eliminar el trailer:', error.message);
      }
    }
  };

  const handleEditar = (id) => {
    settrailerId(id);
    const trailerSeleccionada = trailers.find((trailer) => trailer.id === id);
    setEditFormData({
      url: trailerSeleccionada.url,
      title: trailerSeleccionada.title,
      description: trailerSeleccionada.description,
      directors: trailerSeleccionada.director.map((director) => ({
        value: director.id,
        label: director.nombre,
      })),
      actors: trailerSeleccionada.cast.map((actor) => ({
        value: actor.id,
        label: actor.nombre,
      })),
      image: null,
      currentImgURL:`${IP}/imgServidor/${trailerSeleccionada.imgURL}`,
    });
  
    handleShowEditarModal();
  };

  const handleCrear = async () => {
        try {
          const formDataToSend = new FormData();
          formDataToSend.append('url', formData.url);
          formDataToSend.append('title', formData.title);
          formDataToSend.append('description', formData.description);
          formDataToSend.append('image', formData.image);
      
          formData.actors.forEach(actor => formDataToSend.append('actors', actor.value));
          formData.directors.forEach(director => formDataToSend.append('directors', director.value));
      
          const response = await fetch(`${IP}/trailers`, {
            method: 'POST',
            body: formDataToSend,
          });
      
          if (response.ok) {
            handleCloseCrearModal();
            const updatedtrailers = await (await fetch(`${IP}/trailers`)).json();
            settrailers(updatedtrailers);
          } else {
            console.error('Error al crear el trailer:', response.statusText);
          }
        } catch (error) {
          console.error('Error al crear el trailer:', error.message);
        }
  };
  const handleGuardarCambios = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('url', editFormData.url);
      formDataToSend.append('title', editFormData.title);
      formDataToSend.append('description', editFormData.description);
      formDataToSend.append('image', editFormData.image);
  
      editFormData.actors.forEach(actor => formDataToSend.append('actors', actor.value));
      editFormData.directors.forEach(director => formDataToSend.append('directors', director.value));
      const response = await fetch(`${IP}/trailers/${trailerId}`, {
        method: 'PUT',
        body: formDataToSend,
      });
  
      if (response.ok) {
        handleCloseEditarModal();
        const updatedtrailers = await (await fetch(`${IP}/trailers`)).json();
        settrailers(updatedtrailers);
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


  const filtertrailers = (trailer, term) => {
    const normalizedTerm = term.toLowerCase();
    return (
      trailer.title.toLowerCase().includes(normalizedTerm)
    );
  };
  
  const filteredtrailers = trailers.filter((trailer) =>
    filtertrailers(trailer, searchTerm)
  );

  const handletrailersPerPageChange = (e) => {
    const newtrailersPerPage = parseInt(e.target.value, 10);
    settrailersPerPage(newtrailersPerPage);
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
          <FontAwesomeIcon icon={faPlus} /> Crear trailer
        </Button>
        <hr></hr>
        <div className="row">
           <div className="col-8">
              <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faSearch} />
              &nbsp;
              <Form.Control
                type="text"
                placeholder="Buscar trailer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              </div>
          </div>
          <div className="col-4">
          <Form.Group controlId="trailersPerPageSelect">
            <Form.Control
              as="select"
              value={trailersPerPage}
              onChange={handletrailersPerPageChange}
            >
              <option value={10}>10 trailers por pagina</option>
              <option value={1}>1 trailer por pagina</option>
              <option value={5}>5 trailers por pagina</option>
              <option value={20}>20 trailers por pagina</option>
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredtrailers.sort((a, b) => {
              const multiplier = sortOrder === 'asc' ? 1 : -1;
              switch (sortBy) {
                case 'id':
                  return (a.id - b.id) * multiplier;
                case 'title':
                  return a.title.localeCompare(b.title) * multiplier;
                default:
                  return 0;
              }
            }).slice((currentPage - 1) * trailersPerPage, currentPage * trailersPerPage)
              .map((trailer) => (
              <tr key={trailer.id}>
                <td>{trailer.id}</td>
                <td><img src={IP+'/imgServidor/'+trailer.imgURL} className="thumbnail-image" alt={trailer.title} /></td>
                <td>{trailer.title}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditar(trailer.id)}>
                    <FontAwesomeIcon icon={faEdit} /> Editar
                  </Button>
                  &nbsp;
                  <Button variant="danger" onClick={() => handleEliminar(trailer.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                  </Button>
                  &nbsp;
                  <Button variant="secondary" onClick={() => handleShowDetallesModal(trailer.id)}>
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
            {Array.from({ length: Math.ceil(filteredtrailers.length / trailersPerPage) }).map((_, index) => (
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
        {/* Modal para Crear trailer */}
        <Modal show={showCrearModal} onHide={handleCloseCrearModal}>
          <Modal.Header closeButton>
            <Modal.Title>Crear trailer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group controlId="image">
                    <Form.Label>Imagen de el trailer</Form.Label>
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
              formData.description.trim() === ''
            }
          >
            Crear trailer
          </Button>
            <Button variant="secondary" onClick={handleCloseCrearModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para Editar trailer */}
        <Modal show={showEditarModal} onHide={handleCloseEditarModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar trailer</Modal.Title>
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
              editFormData.description.trim() === ''
            }
          >
            Guardar Cambios
          </Button>
            <Button variant="secondary" onClick={handleCloseEditarModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal para Detalles trailer */}
        <Modal show={showDetallesModal} onHide={handleCloseDetallesModal}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles de trailer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detallestrailer && (
              <div>
                <p>ID: {detallestrailer.id}</p>
                <p>Imagen: <img src={IP+'/imgServidor/'+detallestrailer.imgURL} className="thumbnail-image" alt={detallestrailer.title} /></p>
                <p>Título: {detallestrailer.title}</p>
                <p>Descripción: {detallestrailer.description}</p>

                {detallestrailer.cast && detallestrailer.cast.length > 0 && (
                  <div>
                    <h5>Actores:</h5>
                    <ul>
                      {detallestrailer.cast.map((actor) => (
                        <li key={actor.id}>
                          <img src={`${IP}/imgServidor/${actor.imgURL}`} className="thumbnail-image" alt={actor.nombre} />
                          {actor.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detallestrailer.director && detallestrailer.director.length > 0 && (
                  <div>
                    <h5>Directores:</h5>
                    <ul>
                      {detallestrailer.director.map((director) => (
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