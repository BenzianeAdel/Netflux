import React from "react";
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import {Inicio} from '../Componentes/Inicio';
import { Detalle } from '../Componentes/Detalle';
import {Trailers} from '../Componentes/Trailers';
import {Documentales} from '../Componentes/Documentales';
import {Peliculas} from '../Componentes/Peliculas';
import {Recomendaciones} from '../Componentes/Recomendaciones';
import {Television} from '../Componentes/Television';
import { Footer } from "../Componentes/layout/Footer";
import { Header } from "../Componentes/layout/Header";
import { Administracion } from "../Componentes/Administracion";
import { Login } from "../Componentes/Login";


export const RouterPrincipal = () =>{
    const isAuthenticated = !!localStorage.getItem('usuario');
    return(
        <BrowserRouter>
            <Header/>
            <section className="contenido-principal">
                <Routes>
                    <Route path="/" element={<Inicio/>}/>
                    <Route path="/inicio" element={<Inicio/>}/>
                    <Route path="/peliculas" element={<Peliculas/>}/>
                    <Route path="/trailers" element={<Trailers/>}/>
                    <Route path="/documentales" element={<Documentales/>}/>
                    {isAuthenticated ? (
                        <Route path="/administracion" element={<Administracion />} />
                    ) : (
                        <Route path="/inicio" element={<Inicio />} />
                    )}
                    <Route path="/login" element={<Login />} />
                    <Route path="/recomendaciones" element={<Recomendaciones/>}/>
                    <Route path="/television" element={<Television/>}/>
                    <Route path="/detalles/:id/:type" element={<Detalle/>}/>
                    <Route path="*" element={<Navigate to="/inicio"/>}/>
                </Routes>
            </section>   
            <Footer/>
        </BrowserRouter>
    )
}