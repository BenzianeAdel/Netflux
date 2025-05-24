import React from 'react';
import constructionImage from '../construccion.jpg';

export const Documentales= () =>{
    return (
        
        <div className="container-fluid bg-light py-5">
        <div className="container">
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Página en Construcción</h1>
            <p>¡Estamos trabajando en ello y pronto estará disponible!</p>
            <img src={constructionImage} alt="En Construcción" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
        </div>
      </div>
      );
}