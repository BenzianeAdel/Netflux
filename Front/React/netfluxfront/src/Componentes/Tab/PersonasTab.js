import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faInfo, faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import IP from '../../Configuracion/Config';

export const PersonasTab = () =>{
  const [personaId,setpersonaId] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [detallespersona, setDetallespersona] = useState(null);
  const [personas, setpersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [PersonasPerPage, setPersonasPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('id');


  const handleShowCrearModal = () => setShowCrearModal(true);
  const handleCloseCrearModal = () => setShowCrearModal(false);
  const handleShowEditarModal = () => setShowEditarModal(true);
  const handleCloseEditarModal = () => setShowEditarModal(false);

  const handleShowDetallesModal = (id) => {
    const personaSeleccionada = personas.find((persona) => persona.id === id);
    setDetallespersona(personaSeleccionada);
    setShowDetallesModal(true);
  };
  
  const handleCloseDetallesModal = () => setShowDetallesModal(false);

  useEffect(() => {
    fetch(`${IP}/personas`)
      .then(response => response.json())
      .then(data => {
        setpersonas(data);
      })
      .catch(error => console.error('Error: ', error));
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
    nombre: '',
    image: null,
    currentImgURL: '',
  });

  const [editFormData, setEditFormData] = useState({
    nombre: '',
    image: null,
    currentImgURL: '',
  });

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta persona?");

    if (confirmacion) {
      try {
        const response = await fetch(`${IP}/personas/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedpersonas = await (await fetch(`${IP}/personas`)).json();
          setpersonas(updatedpersonas);
        } else {
          console.error('Error al eliminar la persona:', response.statusText);
        }
      } catch (error) {
        console.error('Error al eliminar la persona:', error.message);
      }
    }
  };

  const handleEditar = (id) => {
    setpersonaId(id);
    const personaSeleccionada = personas.find((persona) => persona.id === id);
  
    setEditFormData({
      nombre: personaSeleccionada.nombre,
      image: null,
      currentImgURL:`${IP}/imgServidor/${personaSeleccionada.imgURL}`,
    });
  
    handleShowEditarModal();
  };

  const handleCrear = async () => {
        try {
          const formDataToSend = new FormData();
          formDataToSend.append('nombre', formData.nombre);
          formDataToSend.append('image', formData.image);
      
          const response = await fetch(`${IP}/personas`, {
            method: 'POST',
            body: formDataToSend,
          });
      
          if (response.ok) {
            handleCloseCrearModal();
            const updatedpersonas = await (await fetch(`${IP}/personas`)).json();
            setpersonas(updatedpersonas);
          } else {
            console.error('Error al crear la persona:', response.statusText);
          }
        } catch (error) {
          console.error('Error al crear la persona:', error.message);
        }
  };
  const handleGuardarCambios = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', editFormData.nombre);
      formDataToSend.append('image', editFormData.image);
  
      const response = await fetch(`${IP}/personas/${personaId}`, {
        method: 'PUT',
        body: formDataToSend,
      });
  
      if (response.ok) {
        handleCloseEditarModal();
        const updatedpersonas = await (await fetch(`${IP}/personas`)).json();
        setpersonas(updatedpersonas);
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


  const filterPersonas = (persona, term) => {
    const normalizedTerm = term.toLowerCase();
    return (
      persona.nombre.toLowerCase().includes(normalizedTerm)
    );
  };
  
  const filteredPersonas = personas.filter((persona) =>
    filterPersonas(persona, searchTerm)
  );

  const handlePersonasPerPageChange = (e) => {
    const newPersonasPerPage = parseInt(e.target.value, 10);
    setPersonasPerPage(newPersonasPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid">
      <div className="container mt-5">
        <Button variant="primary" onClick={handleShowCrearModal}>
          <FontAwesomeIcon icon={faPlus} /> Crear persona
        </Button>
        <hr></hr>
        <div className="row">
           <div className="col-8">
              <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faSearch} />
              &nbsp;
              <Form.Control
                type="text"
                placeholder="Buscar persona..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              </div>
          </div>
          <div className="col-4">
          <Form.Group controlId="PersonasPerPageSelect">
            <Form.Control
              as="select"
              value={PersonasPerPage}
              onChange={handlePersonasPerPageChange}
            >
              <option value={10}>10 personas por pagina</option>
              <option value={1}>1 persona por pagina</option>
              <option value={5}>5 personas por pagina</option>
              <option value={20}>20 personas por pagina</option>
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
              <th onClick={() => handleSort('nombre')}>
                Nombre{' '}
                {sortBy === 'nombre' && (
                  <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp : faArrowDown} />
                )}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPersonas.sort((a, b) => {
              const multiplier = sortOrder === 'asc' ? 1 : -1;
              switch (sortBy) {
                case 'id':
                  return (a.id - b.id) * multiplier;
                case 'nombre':
                  return a.nombre.localeCompare(b.nombre) * multiplier;
                default:
                  return 0;
              }
            }).slice((currentPage - 1) * PersonasPerPage, currentPage * PersonasPerPage)
              .map((persona) => (
              <tr key={persona.id}>
                <td>{persona.id}</td>
                <td><img src={IP+'/imgServidor/'+persona.imgURL} className="thumbnail-image" alt={persona.title} /></td>
                <td>{persona.nombre}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditar(persona.id)}>
                    <FontAwesomeIcon icon={faEdit} /> Editar
                  </Button>
                  &nbsp;
                  <Button variant="danger" onClick={() => handleEliminar(persona.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                  </Button>
                  &nbsp;
                  <Button variant="secondary" onClick={() => handleShowDetallesModal(persona.id)}>
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
            {Array.from({ length: Math.ceil(filteredPersonas.length / PersonasPerPage) }).map((_, index) => (
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
        {/* Modal para Crear persona */}
        <Modal show={showCrearModal} onHide={handleCloseCrearModal}>
          <Modal.Header closeButton>
            <Modal.Title>Crear persona</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group controlId="image">
                    <Form.Label>Imagen de la persona</Form.Label>
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
            
                <Form.Group controlId="nombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    isInvalid={!formData.nombre.trim()}
                      />
                    <Form.Control.Feedback type="invalid">
                      Ingrese un Nombre válido.
                    </Form.Control.Feedback>
                </Form.Group>
                &nbsp;
            </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            onClick={handleCrear}
            disabled={
              !formData.image ||
              formData.nombre.trim() === ''
            }
          >
            Crear persona
          </Button>
            <Button variant="secondary" onClick={handleCloseCrearModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para Editar persona */}
        <Modal show={showEditarModal} onHide={handleCloseEditarModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar persona</Modal.Title>
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
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
              type="text"
              name="nombre"
              value={editFormData.nombre}
              onChange={(e) => handleEditInputChange(e, 'nombre')}
              isInvalid={!editFormData.nombre.trim()}
                      />
                <Form.Control.Feedback type="invalid">
                      Ingrese un Nombre válido.
                </Form.Control.Feedback>
            </Form.Group>
                &nbsp;
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
            variant="primary"
            type="submit"
            onClick={handleGuardarCambios}
            disabled={
              (!editFormData.image && !editFormData.currentImgURL) ||
              editFormData.nombre.trim() === ''
            }
          >
            Guardar Cambios
          </Button>
            <Button variant="secondary" onClick={handleCloseEditarModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal para Detalles persona */}
        <Modal show={showDetallesModal} onHide={handleCloseDetallesModal}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles de persona</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detallespersona && (
              <div>
                <p>ID: {detallespersona.id}</p>
                <p>Imagen: <img src={IP+'/imgServidor/'+detallespersona.imgURL} className="thumbnail-image" alt={detallespersona.nombre} /></p>
                <p>Nombre: {detallespersona.nombre}</p>
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