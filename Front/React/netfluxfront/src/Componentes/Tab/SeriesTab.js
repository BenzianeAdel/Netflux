import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Pagination } from 'react-bootstrap'; // Asegúrate de tener instalada esta librería
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faInfo, faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import IP from '../../Configuracion/Config';
import Select from 'react-select';

export const SeriesTab = () =>{
    const [serieId,setSerieId] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [detallesSerie, setDetallesSerie] = useState(null);
  const [series, setSeries] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [seriesPerPage, setSeriesPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('id');


  const handleShowCrearModal = () => setShowCrearModal(true);
  const handleCloseCrearModal = () => setShowCrearModal(false);
  const handleShowEditarModal = () => setShowEditarModal(true);
  const handleCloseEditarModal = () => setShowEditarModal(false);

  const handleShowDetallesModal = (id) => {
    const serieSeleccionada = series.find((serie) => serie.id === id);
    setDetallesSerie(serieSeleccionada);
    setShowDetallesModal(true);
  };
  
  const handleCloseDetallesModal = () => setShowDetallesModal(false);

  useEffect(() => {
    fetch(`${IP}/series`)
      .then(response => response.json())
      .then(data => {
        setSeries(data);
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
    yearStart: '',
    yearEnd: '',
    seasons: '',
    creators: [],
    actors: [],
    image: null,
    currentImgURL: '',
    destacada: false,
  });

  const [editFormData, setEditFormData] = useState({
    url: '',
    title: '',
    description: '',
    yearStart: '',
    yearEnd: '',
    seasons: '',
    creators: [],
    actors: [],
    image: null,
    currentImgURL: '',
    destacada: false,
  });

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta serie?");

    if (confirmacion) {
      try {
        const response = await fetch(`${IP}/series/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedSeries = await (await fetch(`${IP}/series`)).json();
          setSeries(updatedSeries);
        } else {
          console.error('Error al eliminar la serie:', response.statusText);
        }
      } catch (error) {
        console.error('Error al eliminar la serie:', error.message);
      }
    }
  };

  const handleEditar = (id) => {
    setSerieId(id);
    const serieSeleccionada = series.find((serie) => serie.id === id);
  
    setEditFormData({
      url: serieSeleccionada.url,
      title: serieSeleccionada.title,
      description: serieSeleccionada.description,
      yearStart: serieSeleccionada.yearStart,
      yearEnd: serieSeleccionada.yearEnd,
      seasons: serieSeleccionada.seasons,
      destacada: serieSeleccionada.destacada,
      creators: serieSeleccionada.creators.map((director) => ({
        value: director.id,
        label: director.nombre,
      })),
      actors: serieSeleccionada.cast.map((actor) => ({
        value: actor.id,
        label: actor.nombre,
      })),
      image: null,
      currentImgURL:`${IP}/imgServidor/${serieSeleccionada.imgURL}`,
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
          formDataToSend.append('yearStart', formData.yearStart);
          formDataToSend.append('yearEnd', formData.yearEnd);
          formDataToSend.append('seasons', formData.seasons);
          formDataToSend.append('image', formData.image);
      
          formData.actors.forEach(actor => formDataToSend.append('actors', actor.value));
          formData.creators.forEach(director => formDataToSend.append('creators', director.value));
      
          const response = await fetch(`${IP}/series`, {
            method: 'POST',
            body: formDataToSend,
          });
      
          if (response.ok) {
            handleCloseCrearModal();
            const updatedSeries = await (await fetch(`${IP}/series`)).json();
            setSeries(updatedSeries);
          } else {
            console.error('Error al crear la serie:', response.statusText);
          }
        } catch (error) {
          console.error('Error al crear la serie:', error.message);
        }
  };
  const handleGuardarCambios = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('url', editFormData.url);
      formDataToSend.append('title', editFormData.title);
      formDataToSend.append('description', editFormData.description);
      formDataToSend.append('yearStart', editFormData.yearStart);
      formDataToSend.append('destacada', editFormData.destacada);
      formDataToSend.append('yearEnd', editFormData.yearEnd);
      formDataToSend.append('seasons', editFormData.seasons);
      formDataToSend.append('image', editFormData.image);
  
      editFormData.actors.forEach(actor => formDataToSend.append('actors', actor.value));
      editFormData.creators.forEach(director => formDataToSend.append('creators', director.value));
      const response = await fetch(`${IP}/series/${serieId}`, {
        method: 'PUT',
        body: formDataToSend,
      });
  
      if (response.ok) {
        handleCloseEditarModal();
        const updatedSeries = await (await fetch(`${IP}/series`)).json();
        setSeries(updatedSeries);
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
      creators: selectedOptions,
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
      creators: selectedOptions,
    });
  };


  const filterSeries = (serie, term) => {
    const normalizedTerm = term.toLowerCase();
    return (
      serie.title.toLowerCase().includes(normalizedTerm) ||
      serie.yearStart.toString().includes(normalizedTerm) ||
      serie.yearEnd.toString().includes(normalizedTerm) ||
      serie.seasons.toString().includes(normalizedTerm)
    );
  };
  
  const filteredSeries = series.filter((serie) =>
    filterSeries(serie, searchTerm)
  );

  const handleSeriesPerPageChange = (e) => {
    const newSeriesPerPage = parseInt(e.target.value, 10);
    setSeriesPerPage(newSeriesPerPage);
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
          <FontAwesomeIcon icon={faPlus} /> Crear Serie
        </Button>
        <hr></hr>
        <div className="row">
           <div className="col-8">
              <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faSearch} />
              &nbsp;
              <Form.Control
                type="text"
                placeholder="Buscar serie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              </div>
          </div>
          <div className="col-4">
          <Form.Group controlId="seriesPerPageSelect">
            <Form.Control
              as="select"
              value={seriesPerPage}
              onChange={handleSeriesPerPageChange}
            >
              <option value={10}>10 series por pagina</option>
              <option value={1}>1 serie por pagina</option>
              <option value={5}>5 series por pagina</option>
              <option value={20}>20 series por pagina</option>
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
              <th onClick={() => handleSort('yearStart')}>
                Año de inicio{' '}
                {sortBy === 'yearStart' && (
                  <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp : faArrowDown} />
                )}
              </th>
              <th onClick={() => handleSort('yearEnd')}>
                Año de fin{' '}
                {sortBy === 'yearEnd' && (
                  <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp : faArrowDown} />
                )}
              </th>
              <th onClick={() => handleSort('seasons')}>
                Temporadas{' '}
                {sortBy === 'seasons' && (
                  <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp : faArrowDown} />
                )}
              </th>
              <th>Destacada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSeries.sort((a, b) => {
              const multiplier = sortOrder === 'asc' ? 1 : -1;
              switch (sortBy) {
                case 'id':
                  return (a.id - b.id) * multiplier;
                case 'title':
                  return a.title.localeCompare(b.title) * multiplier;
                case 'yearStart':
                  return (a.yearStart - b.yearStart) * multiplier;
                case 'yearEnd':
                  return (a.yearEnd - b.yearEnd) * multiplier;
                case 'seasons':
                  return (a.seasons - b.seasons) * multiplier;
                default:
                  return 0;
              }
            }).slice((currentPage - 1) * seriesPerPage, currentPage * seriesPerPage)
              .map((serie) => (
              <tr key={serie.id}>
                <td>{serie.id}</td>
                <td><img src={IP+'/imgServidor/'+serie.imgURL} className="thumbnail-image" alt={serie.title} /></td>
                <td>{serie.title}</td>
                <td>{serie.yearStart}</td>
                <td>{serie.yearEnd}</td>
                <td>{serie.seasons}</td>
                <td>{serie.destacada ? '⭐' : '❌'}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditar(serie.id)}>
                    <FontAwesomeIcon icon={faEdit} /> Editar
                  </Button>
                  &nbsp;
                  <Button variant="danger" onClick={() => handleEliminar(serie.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                  </Button>
                  &nbsp;
                  <Button variant="secondary" onClick={() => handleShowDetallesModal(serie.id)}>
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
            {Array.from({ length: Math.ceil(filteredSeries.length / seriesPerPage) }).map((_, index) => (
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
        {/* Modal para Crear Serie */}
        <Modal show={showCrearModal} onHide={handleCloseCrearModal}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Serie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group controlId="image">
                    <Form.Label>Imagen de la Serie</Form.Label>
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
                <Form.Group controlId="yearStart">
                    <Form.Label>Año de inicio</Form.Label>
                    <Form.Control
                        type="number"
                        name="yearStart"
                        value={formData.yearStart}
                        onChange={handleInputChange}
                        isInvalid={isNaN(formData.yearStart) || formData.yearStart < 1900}
                    />
                    <Form.Control.Feedback type="invalid">
                     {isNaN(formData.yearStart) ? 'Ingrese un año válido.' : 'Año debe ser mayor o igual a 1900.'}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="yearEnd">
                    <Form.Label>Año de fin</Form.Label>
                    <Form.Control
                        type="number"
                        name="yearEnd"
                        value={formData.yearEnd}
                        onChange={handleInputChange}
                        isInvalid={isNaN(formData.yearEnd)}
                    />
                    <Form.Control.Feedback type="invalid">
                     Ingrese un año válido.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="seasons">
                    <Form.Label>Temporadas</Form.Label>
                    <Form.Control
                        type="number"
                        name="seasons"
                        value={formData.seasons}
                        onChange={handleInputChange}
                        isInvalid={isNaN(formData.seasons) || formData.seasons <= 0}
                    />
                    <Form.Control.Feedback type="invalid">
                      {isNaN(formData.seasons) ? 'Ingrese numero de temporadas válido.' : 'El número de temporadas debe ser mayor a 0.'}
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
                    <Form.Label>Creadores</Form.Label>
                    <Select
                    isMulti
                    options={personas}
                    value={formData.creators}
                    onChange={handleDirectorsChange}
                    isInvalid={formData.creators.length<= 0}
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
              !formData.creators ||
              formData.creators.length === 0 ||
              !isValidURL(formData.url) ||
              formData.title.trim() === '' ||
              formData.description.trim() === '' ||
              isNaN(formData.yearStart) || formData.yearStart < 1900 ||
              isNaN(formData.yearEnd) ||
              isNaN(formData.seasons) || formData.seasons <= 0
            }
          >
            Crear Serie
          </Button>
            <Button variant="secondary" onClick={handleCloseCrearModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para Editar Serie */}
        <Modal show={showEditarModal} onHide={handleCloseEditarModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Serie</Modal.Title>
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
            <Form.Group controlId="yearStart">
              <Form.Label>Año de inicio</Form.Label>
              <Form.Control
              type="number"
              name="yearStart"
              value={editFormData.yearStart}
              onChange={(e) => handleEditInputChange(e, 'yearStart')}
              isInvalid={isNaN(editFormData.yearStart) || editFormData.yearStart < 1900}
                    />
              <Form.Control.Feedback type="invalid">
                     {isNaN(editFormData.yearStart) ? 'Ingrese un año válido.' : 'Año debe ser mayor o igual a 1900.'}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="yearEnd">
              <Form.Label>Año de fin</Form.Label>
              <Form.Control
              type="number"
              name="yearEnd"
              value={editFormData.yearEnd}
              onChange={(e) => handleEditInputChange(e, 'yearEnd')}
              isInvalid={(isNaN(editFormData.yearEnd))}
              />
              <Form.Control.Feedback type="invalid">
                     Ingrese un año válido.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="seasons">
              <Form.Label>Temporadas</Form.Label>
              <Form.Control
                type="number"
                name="seasons"
                value={editFormData.seasons}
                onChange={(e) => handleEditInputChange(e, 'seasons')}
                isInvalid={isNaN(editFormData.seasons) || editFormData.seasons <= 0}
                    />
                <Form.Control.Feedback type="invalid">
                      {isNaN(editFormData.seasons) ? 'Ingrese un número de temporadas válido.' : 'El número de temporadas debe ser mayor a 0.'}
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
              <Form.Label>Creadores</Form.Label>
              <Select
              isMulti
              options={personas}
              value={editFormData.creators}
              onChange={handleDirectorsEditChange}
              isInvalid={editFormData.creators.length<= 0}
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
              !editFormData.creators ||
              editFormData.creators.length === 0 ||
              !isValidURL(editFormData.url) ||
              editFormData.title.trim() === '' ||
              editFormData.description.trim() === '' ||
              isNaN(editFormData.yearStart) || editFormData.yearStart < 1900 ||
              isNaN(editFormData.yearEnd) ||
              isNaN(editFormData.seasons) || editFormData.seasons <= 0
            }
          >
            Guardar Cambios
          </Button>
            <Button variant="secondary" onClick={handleCloseEditarModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal para Detalles Serie */}
        <Modal show={showDetallesModal} onHide={handleCloseDetallesModal}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles de Serie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detallesSerie && (
              <div>
                <p>ID: {detallesSerie.id}</p>
                <p>Imagen: <img src={IP+'/imgServidor/'+detallesSerie.imgURL} className="thumbnail-image" alt={detallesSerie.title} /></p>
                <p>Título: {detallesSerie.title}</p>
                <p>Año de inicio: {detallesSerie.yearStart}</p>
                <p>Año de fin: {detallesSerie.yearEnd}</p>
                <p>Temporadas: {detallesSerie.seasons}</p>
                <p>Descripción: {detallesSerie.description}</p>

                {detallesSerie.cast && detallesSerie.cast.length > 0 && (
                  <div>
                    <h5>Actores:</h5>
                    <ul>
                      {detallesSerie.cast.map((actor) => (
                        <li key={actor.id}>
                          <img src={`${IP}/imgServidor/${actor.imgURL}`} className="thumbnail-image" alt={actor.nombre} />
                          {actor.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detallesSerie.creators && detallesSerie.creators.length > 0 && (
                  <div>
                    <h5>Creadores:</h5>
                    <ul>
                      {detallesSerie.creators.map((director) => (
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