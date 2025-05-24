import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faInfo, faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import IP from '../../Configuracion/Config';

export const UsuariosTab = () =>{
  const [usuarioId,setusuarioId] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [detallesusuario, setDetallesusuario] = useState(null);
  const [usuarios, setusuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usuariosPerPage, setusuariosPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  const [loggedInUsername, setLoggedInUsername] = useState('');


  const handleShowCrearModal = () => setShowCrearModal(true);
  const handleCloseCrearModal = () => setShowCrearModal(false);
  const handleShowEditarModal = () => setShowEditarModal(true);
  const handleCloseEditarModal = () => setShowEditarModal(false);

  const handleShowDetallesModal = (id) => {
    const usuarioSeleccionada = usuarios.find((usuario) => usuario.id === id);
    setDetallesusuario(usuarioSeleccionada);
    setShowDetallesModal(true);
  };
  
  const handleCloseDetallesModal = () => setShowDetallesModal(false);

  useEffect(() => {
    const storedUsername = JSON.parse(localStorage.getItem('usuario'));
    setLoggedInUsername(storedUsername);
    fetch(`${IP}/usuarios`)
      .then(response => response.json())
      .then(data => {
        setusuarios(data);
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
    username: '',
    password: '',
  });

  const [editFormData, setEditFormData] = useState({
    username: '',
    password: '',
  });

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este usuario?");

    if (confirmacion) {
      try {
        const response = await fetch(`${IP}/usuarios/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedusuarios = await (await fetch(`${IP}/usuarios`)).json();
          setusuarios(updatedusuarios);
        } else {
          console.error('Error al eliminar el usuario:', response.statusText);
        }
      } catch (error) {
        console.error('Error al eliminar el usuario:', error.message);
      }
    }
  };

  const handleEditar = (id) => {
    setusuarioId(id);
    const usuarioSeleccionada = usuarios.find((usuario) => usuario.id === id);
  
    setEditFormData({
      username: usuarioSeleccionada.username,
      password: usuarioSeleccionada.password,
    });
  
    handleShowEditarModal();
  };

  const handleCrear = async () => {
        try {
          const formDataToSend = new FormData();
          formDataToSend.append('username', formData.username);
          formDataToSend.append('password', formData.password);
      
          const response = await fetch(`${IP}/usuarios`, {
            method: 'POST',
            body: formDataToSend,
          });
      
          if (response.ok) {
            handleCloseCrearModal();
            const updatedusuarios = await (await fetch(`${IP}/usuarios`)).json();
            setusuarios(updatedusuarios);
          } else {
            console.error('Error al crear el usuario:', response.statusText);
          }
        } catch (error) {
          console.error('Error al crear el usuario:', error.message);
        }
  };
  const handleGuardarCambios = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', editFormData.username);
      formDataToSend.append('password', editFormData.password);
  
      const response = await fetch(`${IP}/usuarios/${usuarioId}`, {
        method: 'PUT',
        body: formDataToSend,
      });
  
      if (response.ok) {
        handleCloseEditarModal();
        const updatedusuarios = await (await fetch(`${IP}/usuarios`)).json();
        setusuarios(updatedusuarios);
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
      const { value } = e.target;
      setEditFormData({
        ...editFormData,
        [field]: value,
      });
  };

  const filterusuarios = (usuario, term) => {
    const normalizedTerm = term.toLowerCase();
    return (
      usuario.username.toLowerCase().includes(normalizedTerm) ||
      usuario.password.toLowerCase().includes(normalizedTerm) 
    );
  };
  
  const filteredusuarios = usuarios.filter((usuario) =>
    filterusuarios(usuario, searchTerm)
  );

  const handleusuariosPerPageChange = (e) => {
    const newusuariosPerPage = parseInt(e.target.value, 10);
    setusuariosPerPage(newusuariosPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid">
      <div className="container mt-5">
        <Button variant="primary" onClick={handleShowCrearModal}>
          <FontAwesomeIcon icon={faPlus} /> Crear usuario
        </Button>
        <hr></hr>
        <div className="row">
           <div className="col-8">
              <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faSearch} />
              &nbsp;
              <Form.Control
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              </div>
          </div>
          <div className="col-4">
          <Form.Group controlId="usuariosPerPageSelect">
            <Form.Control
              as="select"
              value={usuariosPerPage}
              onChange={handleusuariosPerPageChange}
            >
              <option value={10}>10 usuarios por pagina</option>
              <option value={1}>1 usuario por pagina</option>
              <option value={5}>5 usuarios por pagina</option>
              <option value={20}>20 usuarios por pagina</option>
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
              <th onClick={() => handleSort('username')}>
                Username{' '}
                {sortBy === 'username' && (
                  <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp : faArrowDown} />
                )}
              </th>
              <th onClick={() => handleSort('password')}>
                Password{' '}
                {sortBy === 'password' && (
                  <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp : faArrowDown} />
                )}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredusuarios.sort((a, b) => {
              const multiplier = sortOrder === 'asc' ? 1 : -1;
              switch (sortBy) {
                case 'id':
                  return (a.id - b.id) * multiplier;
                case 'username':
                  return a.username.localeCompare(b.username) * multiplier;
                case 'password':
                  return a.password.localeCompare(b.password) * multiplier;
                default:
                  return 0;
              }
            }).slice((currentPage - 1) * usuariosPerPage, currentPage * usuariosPerPage)
              .map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>
                    {usuario.username === loggedInUsername.username ? (
                    <>
                        {usuario.username} <span className="badge bg-success">Tu</span>
                    </>
                    ) : (
                    usuario.username
                    )}
                </td>
                <td>{usuario.password}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditar(usuario.id)}>
                    <FontAwesomeIcon icon={faEdit} /> Editar
                  </Button>
                  &nbsp;
                  {usuario.username !== loggedInUsername.username ? (<Button variant="danger" onClick={() => handleEliminar(usuario.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                  </Button>):(<></>)}
                  &nbsp;
                  <Button variant="secondary" onClick={() => handleShowDetallesModal(usuario.id)}>
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
            {Array.from({ length: Math.ceil(filteredusuarios.length / usuariosPerPage) }).map((_, index) => (
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
        {/* Modal para Crear usuario */}
        <Modal show={showCrearModal} onHide={handleCloseCrearModal}>
          <Modal.Header closeButton>
            <Modal.Title>Crear usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    isInvalid={!formData.username.trim()}
                      />
                    <Form.Control.Feedback type="invalid">
                      Ingrese un username válido.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    isInvalid={!formData.password.trim()}
                      />
                    <Form.Control.Feedback type="invalid">
                      Ingrese una contraseña válida.
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
              formData.username.trim() === '' ||
              formData.password.trim() === ''
            }
          >
            Crear usuario
          </Button>
            <Button variant="secondary" onClick={handleCloseCrearModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para Editar usuario */}
        <Modal show={showEditarModal} onHide={handleCloseEditarModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
              type="text"
              name="username"
              value={editFormData.username}
              onChange={(e) => handleEditInputChange(e, 'username')}
              isInvalid={!editFormData.username.trim()}
                      />
                <Form.Control.Feedback type="invalid">
                      Ingrese un username válido.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
              type="text"
              name="password"
              value={editFormData.password}
              onChange={(e) => handleEditInputChange(e, 'password')}
              isInvalid={!editFormData.password.trim()}
                      />
                <Form.Control.Feedback type="invalid">
                      Ingrese una contraseña válida.
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
              editFormData.username.trim() === '' ||
              editFormData.password.trim() === ''
            }
          >
            Guardar Cambios
          </Button>
            <Button variant="secondary" onClick={handleCloseEditarModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal para Detalles usuario */}
        <Modal show={showDetallesModal} onHide={handleCloseDetallesModal}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles de usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detallesusuario && (
              <div>
                <p>ID: {detallesusuario.id}</p>
                <p>Username: {detallesusuario.username}</p>
                <p>Password: {detallesusuario.password}</p>
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