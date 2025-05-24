package com.netflux.backend.service;

import com.netflux.backend.controller.Requests.PeliculaRequest;
import com.netflux.backend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class PeliculaService {
    @Autowired
    PeliculaRepository peliculaRepository;

    @Autowired
    MultimediaRepository multimediaRepository;
    @Autowired
    PersonaRepository personaRepository;

    public Pelicula findPeliculaById(Long peliculaId) {
        return peliculaRepository.findById(peliculaId).orElse(null);
    }
    public List<Pelicula> findPeliculaAll() {
        return (List<Pelicula>) peliculaRepository.findAll();
    }

    public void crearPelicula(PeliculaRequest peliculaRequest, MultipartFile image, List<Long> directors, List<Long> actors) throws IOException {
        Pelicula pelicula = new Pelicula();
        Multimedia multimedia = new Multimedia();
        pelicula.setDurationMinutes(peliculaRequest.getDuration());
        pelicula.setDestacada(peliculaRequest.getDestacada());
        pelicula.setYearRelease(peliculaRequest.getYear());
        List<Persona> directorEntities = (List<Persona>) personaRepository.findAllById(directors);
        List<Persona> actorEntities = (List<Persona>) personaRepository.findAllById(actors);

        multimedia.setActors(actorEntities);
        multimedia.setCreators(directorEntities);
        multimedia.setTitle(peliculaRequest.getTitle());
        multimedia.setDescription(peliculaRequest.getDescription());
        multimedia.setCreationDate(LocalDate.now());
        multimedia.setUrl(peliculaRequest.getUrl());
        pelicula.setMultimedia(multimedia);
        multimediaRepository.save(multimedia);
        peliculaRepository.save(pelicula);
        multimedia.setImgURL("Peliculas/" + pelicula.getId() + "/" + image.getOriginalFilename());
        multimediaRepository.save(multimedia);

        if (!image.isEmpty()) {
            try {
                byte[] bytesImagen = image.getBytes();
                Path rutaCarpeta = Paths.get("src/main/resources/public/imgServidor/Peliculas/" + pelicula.getId() + "/");
                if (!Files.exists(rutaCarpeta)) {
                    Files.createDirectories(rutaCarpeta);
                }
                Path rutaFinal = Paths.get("src/main/resources/public/imgServidor/Peliculas/" + pelicula.getId() + "/" + image.getOriginalFilename());
                Files.write(rutaFinal, bytesImagen);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    public void actualizarPelicula(Long id,PeliculaRequest peliculaRequest, MultipartFile image, List<Long> directors, List<Long> actors) throws IOException {
        Pelicula pelicula = findPeliculaById(id);
        Multimedia multimedia = pelicula.getMultimedia();
        pelicula.setDurationMinutes(peliculaRequest.getDuration());
        pelicula.setDestacada(peliculaRequest.getDestacada());
        pelicula.setYearRelease(peliculaRequest.getYear());
        List<Persona> directorEntities = (List<Persona>) personaRepository.findAllById(directors);
        List<Persona> actorEntities = (List<Persona>) personaRepository.findAllById(actors);

        multimedia.setActors(actorEntities);
        multimedia.setCreators(directorEntities);
        multimedia.setTitle(peliculaRequest.getTitle());
        multimedia.setDescription(peliculaRequest.getDescription());
        multimedia.setUrl(peliculaRequest.getUrl());
        if(image != null){
            if (!image.isEmpty()) {
                multimedia.setImgURL("Peliculas/" + pelicula.getId() + "/" + image.getOriginalFilename());
                String carpetaImagenes = "src/main/resources/public/imgServidor/Peliculas/" + pelicula.getId();
                Path pathCarpeta = Paths.get(carpetaImagenes);
                File carpeta = new File(carpetaImagenes);
                if(carpeta.exists() && carpeta.isDirectory()){
                    try {
                        Files.walk(pathCarpeta)
                                .sorted(Comparator.reverseOrder())
                                .map(Path::toFile)
                                .forEach(File::delete);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                try {
                    byte[] bytesImagen = image.getBytes();
                    Path rutaCarpeta = Paths.get("src/main/resources/public/imgServidor/Peliculas/"+pelicula.getId()+"/");
                    if (!Files.exists(rutaCarpeta)) {
                        Files.createDirectories(rutaCarpeta);
                    }
                    Path rutaFinal = Paths.get("src/main/resources/public/imgServidor/Peliculas/"+pelicula.getId()+"/"+image.getOriginalFilename());
                    Files.write(rutaFinal, bytesImagen);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        multimediaRepository.save(multimedia);
        peliculaRepository.save(pelicula);
    }
    public void eliminarPelicula(Long id) throws IOException {
        Pelicula pelicula = findPeliculaById(id);
        Multimedia multimedia = pelicula.getMultimedia();
        String carpetaImagenes = "src/main/resources/public/imgServidor/Peliculas/" + pelicula.getId();
        Path pathCarpeta = Paths.get(carpetaImagenes);
        File carpeta = new File(carpetaImagenes);
        if(carpeta.exists() && carpeta.isDirectory()){
            try {
                Files.walk(pathCarpeta)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        peliculaRepository.delete(pelicula);
        multimediaRepository.delete(multimedia);
    }

}
