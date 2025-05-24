package com.netflux.backend.controller;


import com.netflux.backend.controller.Requests.TrailerRequest;
import com.netflux.backend.controller.Responses.ResponseTrailers;
import com.netflux.backend.model.Trailer;
import com.netflux.backend.service.TrailerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Controller
@CrossOrigin(origins = "*")
public class TrailerController {

    @Autowired
    TrailerService trailerService;

    @PostMapping("/trailers")
    public ResponseEntity<String> crearTrailer(@ModelAttribute TrailerRequest trailerRequest,
                                                @RequestParam("image") MultipartFile image,
                                                @RequestParam(value = "directors", required = false) List<Long> directors,
                                                @RequestParam(value = "actors", required = false) List<Long> actors) {
        try {
            trailerService.crearTrailer(trailerRequest, image, directors, actors);

            return new ResponseEntity<>("Trailer creado con éxito", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear el trailer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/trailers/{id}")
    public ResponseEntity<String> actualizarTrailer(@PathVariable("id") Long id,@ModelAttribute TrailerRequest trailerRequest,
                                                     @RequestParam(value = "image",required = false) MultipartFile image,
                                                     @RequestParam(value = "directors", required = false) List<Long> directors,
                                                     @RequestParam(value = "actors", required = false) List<Long> actors) {
        try {
            trailerService.actualizarTrailer(id,trailerRequest, image, directors, actors);
            return new ResponseEntity<>("Cambios guardados con éxito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar cambios: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/trailers/{id}")
    public ResponseEntity<String> eliminarTrailer(@PathVariable("id") Long id) {
        try {
            trailerService.eliminarTrailer(id);
            return new ResponseEntity<>("Trailer eliminado con éxito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar trailer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/trailers/{id}")
    @ResponseBody
    public ResponseEntity<?> getPeliculaWithId(@PathVariable("id") Long idTrailer) {
        Trailer trailerBD = trailerService.findTrailerById(idTrailer);

        if (trailerBD != null) {
            ResponseTrailers trailersResponse = new ResponseTrailers();
            trailersResponse.setId(trailerBD.getId());
            trailersResponse.setUrl(trailerBD.getMultimedia().getUrl());
            trailersResponse.setTitle(trailerBD.getMultimedia().getTitle());
            trailersResponse.setImgURL(trailerBD.getMultimedia().getImgURL());
            trailersResponse.setDescription(trailerBD.getMultimedia().getDescription());
            trailersResponse.setDirector(trailerBD.getMultimedia().getCreators());
            trailersResponse.setCast(trailerBD.getMultimedia().getActors());
            return new ResponseEntity<>(trailersResponse, HttpStatus.OK);
        } else {
            String errorMessage = "Trailer con ID " + idTrailer + " no encontrado.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/trailers")
    @ResponseBody
    public ResponseEntity<?> getTrailers() {
        List<Trailer> trailersBD = trailerService.findTrailersAll();

        List<ResponseTrailers> trailersResponse = new ArrayList<>();

        if (trailersBD.isEmpty()) {
            String errorMessage = "No se encontraron trailers.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }
        for (Trailer t : trailersBD) {
            ResponseTrailers trailer = new ResponseTrailers();
            trailer.setId(t.getMultimedia().getTrailer().getId());
            trailer.setUrl(t.getMultimedia().getUrl());
            trailer.setTitle(t.getMultimedia().getTitle());
            trailer.setDescription(t.getMultimedia().getDescription());
            trailer.setDirector(t.getMultimedia().getCreators());
            trailer.setCast(t.getMultimedia().getActors());
            trailer.setImgURL(t.getMultimedia().getImgURL());
            trailersResponse.add(trailer);
        }
        return new ResponseEntity<>(trailersResponse, HttpStatus.OK);
    }
}
