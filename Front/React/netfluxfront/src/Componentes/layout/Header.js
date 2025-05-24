import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export const Header = () => {
    const handleLogout = () => {
        localStorage.removeItem('usuario');
        window.location.href = '/inicio';
    };

    const usuario = localStorage.getItem('usuario');

    return (
        <div className="containerLogo">
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand as={NavLink} to="/inicio">
                    <img
                        src="http://localhost:8080/imgServidor/logo.png"
                        alt="Imagen de encabezado"
                        className="img-fluid"
                        id="logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarSupportedContent" />
                <Navbar.Collapse id="navbarSupportedContent">
                    <Nav className="mx-auto">
                        <Nav.Link as={NavLink} to="/inicio">INICIO</Nav.Link>
                        <Nav.Link as={NavLink} to="/peliculas">PELICULAS</Nav.Link>
                        <Nav.Link as={NavLink} to="/television">TELEVISION</Nav.Link>
                        <Nav.Link as={NavLink} to="/documentales">DOCUMENTALES</Nav.Link>
                        <Nav.Link as={NavLink} to="/recomendaciones">RECOMENDACIONES</Nav.Link>
                        <Nav.Link as={NavLink} to="/trailers">TRAILERS</Nav.Link>

                        {usuario ? (
                            <>
                                <Nav.Link as={NavLink} to="/administracion">ADMINISTRACION</Nav.Link>
                                <Nav.Link onClick={handleLogout}>CERRAR SESIÓN</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={NavLink} to="/login">INICIAR SESIÓN</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};
