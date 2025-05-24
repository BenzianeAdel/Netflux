package com.netflux.backend.controller;


import com.netflux.backend.controller.Requests.PeliculaRequest;
import com.netflux.backend.controller.Responses.ResponseNovedades;
import com.netflux.backend.controller.Responses.ResponsePelicula;
import com.netflux.backend.model.Pelicula;
import com.netflux.backend.service.PeliculaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@CrossOrigin(origins = "*")
public class PeliculaController {
    @Autowired
    PeliculaService peliculaService;

    @PostMapping("/peliculas")
    public ResponseEntity<String> crearPelicula(@ModelAttribute PeliculaRequest peliculaRequest,
                                                @RequestParam("image") MultipartFile image,
                                                @RequestParam(value = "directors", required = false) List<Long> directors,
                                                @RequestParam(value = "actors", required = false) List<Long> actors) {
        try {
            peliculaService.crearPelicula(peliculaRequest, image, directors, actors);

            return new ResponseEntity<>("Película creada con éxito", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear la película: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/peliculas/{id}")
    public ResponseEntity<String> actualizarPelicula(@PathVariable("id") Long id,@ModelAttribute PeliculaRequest peliculaRequest,
                                                     @RequestParam(value = "image",required = false) MultipartFile image,
                                                     @RequestParam(value = "directors", required = false) List<Long> directors,
                                                     @RequestParam(value = "actors", required = false) List<Long> actors) {
        try {
            peliculaService.actualizarPelicula(id,peliculaRequest, image, directors, actors);
            return new ResponseEntity<>("Cambios guardados con éxito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar cambios: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/peliculas/{id}")
    public ResponseEntity<String> eliminarPelicula(@PathVariable("id") Long id) {
        try {
            peliculaService.eliminarPelicula(id);
            return new ResponseEntity<>("Pelicula eliminada con éxito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar pelicula: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/peliculas/{id}")
    @ResponseBody
    public ResponseEntity<?> getPeliculaWithId(@PathVariable("id") Long idPelicula) {
        Pelicula peliculaBD = peliculaService.findPeliculaById(idPelicula);

        if (peliculaBD != null) {
            ResponsePelicula peliculaResponse = new ResponsePelicula();
            peliculaResponse.setId(peliculaBD.getId());
            peliculaResponse.setUrl(peliculaBD.getMultimedia().getUrl());
            peliculaResponse.setDuration(peliculaBD.getDurationMinutes());
            peliculaResponse.setYear(peliculaBD.getYearRelease());
            peliculaResponse.setTitle(peliculaBD.getMultimedia().getTitle());
            peliculaResponse.setImgURL(peliculaBD.getMultimedia().getImgURL());
            peliculaResponse.setDescription(peliculaBD.getMultimedia().getDescription());
            peliculaResponse.setDestacada(peliculaBD.isDestacada());
            peliculaResponse.setDirector(peliculaBD.getMultimedia().getCreators());
            peliculaResponse.setCast(peliculaBD.getMultimedia().getActors());
            return new ResponseEntity<>(peliculaResponse, HttpStatus.OK);
        } else {
            String errorMessage = "Pelicula con ID " + idPelicula + " no encontrada.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/peliculas")
    @ResponseBody
    public ResponseEntity<?> getPeliculaAll() {
        List<Pelicula> peliculasBD = peliculaService.findPeliculaAll();
        List<ResponsePelicula> peliculasResponses = new ArrayList<>();

        if (peliculasBD.isEmpty()) {
            String errorMessage = "No se encontraron películas.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }

        for (Pelicula p : peliculasBD) {
            ResponsePelicula peliculaResponse = new ResponsePelicula();
            peliculaResponse.setId(p.getId());
            peliculaResponse.setUrl(p.getMultimedia().getUrl());
            peliculaResponse.setDuration(p.getDurationMinutes());
            peliculaResponse.setYear(p.getYearRelease());
            peliculaResponse.setTitle(p.getMultimedia().getTitle());
            peliculaResponse.setImgURL(p.getMultimedia().getImgURL());
            peliculaResponse.setDescription(p.getMultimedia().getDescription());
            peliculaResponse.setDestacada(p.isDestacada());
            peliculaResponse.setDirector(p.getMultimedia().getCreators());
            peliculaResponse.setCast(p.getMultimedia().getActors());
            peliculasResponses.add(peliculaResponse);
        }
        return new ResponseEntity<>(peliculasResponses, HttpStatus.OK);
    }
    @GetMapping("/peliculas/novedades")
    @ResponseBody
    public ResponseEntity<?> getPeliculaNovedades() {
        List<Pelicula> peliculasBD = peliculaService.findPeliculaAll();

        if (peliculasBD.isEmpty()) {
            String errorMessage = "No se encontraron novedades en las peliculas.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }

        // Ordenar las películas por fecha de creación (de más reciente a más antigua)
        Collections.sort(peliculasBD, Comparator.comparing(p -> p.getMultimedia().getCreationDate(), Comparator.nullsLast(Comparator.reverseOrder())));

        // Limitar a las 5 películas más recientes
        peliculasBD = peliculasBD.stream().limit(5).collect(Collectors.toList());

        List<ResponseNovedades> novedadesResponse = new ArrayList<>();

        for (Pelicula p : peliculasBD) {
            ResponseNovedades novedad = new ResponseNovedades();
            novedad.setId(p.getId());
            novedad.setUrl(p.getMultimedia().getUrl());
            novedad.setTitle(p.getMultimedia().getTitle());
            novedad.setImgURL(p.getMultimedia().getImgURL());
            novedadesResponse.add(novedad);
        }
        return new ResponseEntity<>(novedadesResponse, HttpStatus.OK);
    }
}
