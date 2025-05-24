import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import imagenInicio from '../administrador.png';
import IP from '../Configuracion/Config';
export const Login = () =>{
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      const response = await fetch(`${IP}/login`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const usuarioAutenticado = { username: formData.username };
        localStorage.setItem('usuario', JSON.stringify(usuarioAutenticado));
        window.location.href = '/inicio';
      } else {
            if (response.status === 401) {
                setError('Credenciales inválidas. Por favor, verifica tu contraseña.');
            } else if (response.status === 404) {
                setError('Usuario no encontrado');
            } else {
                setError('Error de autenticación');
            }
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      setError('Error al intentar iniciar sesión');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '400px' }}>
        <Card.Img
          variant="top"
          src={imagenInicio}
          style={{ width: '100%', height: 'auto' }}
          alt="Imagen de inicio de sesión"
        />
        <Card.Body>
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Nombre de Usuario:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nombre de usuario"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Contraseña:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Iniciar Sesión
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};