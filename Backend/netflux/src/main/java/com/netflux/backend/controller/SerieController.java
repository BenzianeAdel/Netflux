package com.netflux.backend.controller;

import com.netflux.backend.controller.Requests.SerieRequest;
import com.netflux.backend.controller.Responses.ResponseNovedades;
import com.netflux.backend.controller.Responses.ResponseSerie;
import com.netflux.backend.model.Serie;
import com.netflux.backend.service.SerieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@CrossOrigin(origins = "*")
public class SerieController {

    @Autowired
    SerieService serieService;

    @PostMapping("/series")
    public ResponseEntity<String> crearSerie(@ModelAttribute SerieRequest serieRequest,
                                                @RequestParam("image") MultipartFile image,
                                                @RequestParam(value = "creators", required = false) List<Long> creators,
                                                @RequestParam(value = "actors", required = false) List<Long> actors) {
        try {
            serieService.crearSerie(serieRequest, image, creators, actors);

            return new ResponseEntity<>("Serie creada con éxito", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear la serie: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/series/{id}")
    public ResponseEntity<String> actualizarSerie(@PathVariable("id") Long id,@ModelAttribute SerieRequest serieRequest,
                                                     @RequestParam(value = "image",required = false) MultipartFile image,
                                                     @RequestParam(value = "creators", required = false) List<Long> creators,
                                                     @RequestParam(value = "actors", required = false) List<Long> actors) {
        try {
            serieService.actualizarSerie(id,serieRequest, image, creators, actors);
            return new ResponseEntity<>("Cambios guardados con éxito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar cambios: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/series/{id}")
    public ResponseEntity<String> eliminarSerie(@PathVariable("id") Long id) {
        try {
            serieService.eliminarSerie(id);
            return new ResponseEntity<>("Serie eliminada con éxito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar serie: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/series/{id}")
    @ResponseBody
    public ResponseEntity<?> getSerieWithId(@PathVariable("id") Long idSerie) {
        Serie serieBD = serieService.findSerieById(idSerie);

        if (serieBD != null) {
            ResponseSerie serieResponse = new ResponseSerie();
            serieResponse.setId(serieBD.getId());
            serieResponse.setUrl(serieBD.getMultimedia().getUrl());
            serieResponse.setYearEnd(serieBD.getYearEnd());
            serieResponse.setYearStart(serieBD.getYearStart());
            serieResponse.setTitle(serieBD.getMultimedia().getTitle());
            serieResponse.setImgURL(serieBD.getMultimedia().getImgURL());
            serieResponse.setSeasons(serieBD.getSeasons());
            serieResponse.setDescription(serieBD.getMultimedia().getDescription());
            serieResponse.setDestacada(serieBD.isDestacada());
            serieResponse.setCreators(serieBD.getMultimedia().getCreators());
            serieResponse.setCast(serieBD.getMultimedia().getActors());

            return new ResponseEntity<>(serieResponse, HttpStatus.OK);
        } else {
            String errorMessage = "Serie con ID " + idSerie + " no encontrada.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/series")
    @ResponseBody
    public ResponseEntity<?> getSeriesAll() {
        List<Serie> seriesBD = serieService.findSerieAll();
        List<ResponseSerie> seriesResponses = new ArrayList<>();

        if (seriesBD.isEmpty()) {
            String errorMessage = "No se encontraron series.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }

        for (Serie s : seriesBD) {
            ResponseSerie serieResponse = new ResponseSerie();
            serieResponse.setId(s.getId());
            serieResponse.setUrl(s.getMultimedia().getUrl());
            serieResponse.setYearEnd(s.getYearEnd());
            serieResponse.setYearStart(s.getYearStart());
            serieResponse.setTitle(s.getMultimedia().getTitle());
            serieResponse.setImgURL(s.getMultimedia().getImgURL());
            serieResponse.setSeasons(s.getSeasons());
            serieResponse.setDescription(s.getMultimedia().getDescription());
            serieResponse.setDestacada(s.isDestacada());
            serieResponse.setCreators(s.getMultimedia().getCreators());
            serieResponse.setCast(s.getMultimedia().getActors());
            seriesResponses.add(serieResponse);
        }
        return new ResponseEntity<>(seriesResponses, HttpStatus.OK);
    }
    @GetMapping("/series/novedades")
    @ResponseBody
    public ResponseEntity<?> getSeriesNovedades() {
        List<Serie> seriesBD = serieService.findSerieAll();

        if (seriesBD.isEmpty()) {
            String errorMessage = "No se encontraron novedades de series.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }

        // Ordenar las series por fecha de creación (de más reciente a más antigua)
        Collections.sort(seriesBD, Comparator.comparing(p -> p.getMultimedia().getCreationDate(), Comparator.nullsLast(Comparator.reverseOrder())));

        // Limitar a las 5 series más recientes
        seriesBD = seriesBD.stream().limit(5).collect(Collectors.toList());

        List<ResponseNovedades> novedadesResponse = new ArrayList<>();

        for (Serie s : seriesBD) {
            ResponseNovedades novedad = new ResponseNovedades();
            novedad.setId(s.getId());
            novedad.setUrl(s.getMultimedia().getUrl());
            novedad.setTitle(s.getMultimedia().getTitle());
            novedad.setImgURL(s.getMultimedia().getImgURL());
            novedadesResponse.add(novedad);
        }
        return new ResponseEntity<>(novedadesResponse, HttpStatus.OK);
    }
}
