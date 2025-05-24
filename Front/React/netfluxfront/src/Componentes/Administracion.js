import React, { useState } from 'react';
import {PeliculasTab} from './Tab/PeliculasTab';
import {SeriesTab} from './Tab/SeriesTab';
import {PersonasTab} from './Tab/PersonasTab';
import {TrailersTab} from './Tab/TrailersTab';
import { UsuariosTab } from './Tab/UsuariosTab';
export const  Administracion = () => {
  const [selectedTab, setSelectedTab] = useState('peliculas');

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'peliculas':
        return <PeliculasTab />;
      case 'series':
        return <SeriesTab />;
      case 'personas':
        return <PersonasTab />;
      case 'trailers':
        return <TrailersTab />;
        case 'usuarios':
        return <UsuariosTab />;
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
    <div className="container mt-5">
        <ul className="nav nav-tabs">
        <li className="nav-item">
            <button
            className={`nav-link ${selectedTab === 'peliculas' ? 'active' : ''}`}
            onClick={() => handleTabChange('peliculas')}
            >
            Películas
            </button>
        </li>
        <li className="nav-item">
            <button
            className={`nav-link ${selectedTab === 'series' ? 'active' : ''}`}
            onClick={() => handleTabChange('series')}
            >
            Series
            </button>
        </li>
        <li className="nav-item">
            <button
            className={`nav-link ${selectedTab === 'personas' ? 'active' : ''}`}
            onClick={() => handleTabChange('personas')}
            >
            Personas
            </button>
        </li>
        <li className="nav-item">
            <button
            className={`nav-link ${selectedTab === 'trailers' ? 'active' : ''}`}
            onClick={() => handleTabChange('trailers')}
            >
            Trailers
            </button>
        </li>
        <li className="nav-item">
            <button
            className={`nav-link ${selectedTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => handleTabChange('usuarios')}
            >
            Usuarios
            </button>
        </li>
        </ul>
        <div className="tab-content">{renderTabContent()}</div>
    </div>
    </div>
  );
};

export default Administracion;
