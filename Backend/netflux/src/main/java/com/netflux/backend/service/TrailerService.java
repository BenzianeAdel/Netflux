package com.netflux.backend.service;

import com.netflux.backend.controller.Requests.TrailerRequest;
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
public class TrailerService {

    @Autowired
    TrailerRepository trailerRepository;
    @Autowired
    MultimediaRepository multimediaRepository;
    @Autowired
    PersonaRepository personaRepository;

    public Trailer findTrailerById(Long trailerId) {
        return trailerRepository.findById(trailerId).orElse(null);
    }
    public List<Trailer> findTrailersAll() {
        return (List<Trailer>) trailerRepository.findAll();
    }

    public void crearTrailer(TrailerRequest trailerRequest, MultipartFile image, List<Long> directors, List<Long> actors) throws IOException {
        Trailer trailer = new Trailer();
        Multimedia multimedia = new Multimedia();
        List<Persona> directorEntities = (List<Persona>) personaRepository.findAllById(directors);
        List<Persona> actorEntities = (List<Persona>) personaRepository.findAllById(actors);

        multimedia.setActors(actorEntities);
        multimedia.setCreators(directorEntities);
        multimedia.setTitle(trailerRequest.getTitle());
        multimedia.setDescription(trailerRequest.getDescription());
        multimedia.setCreationDate(LocalDate.now());
        multimedia.setUrl(trailerRequest.getUrl());
        trailer.setMultimedia(multimedia);
        multimediaRepository.save(multimedia);
        trailerRepository.save(trailer);
        multimedia.setImgURL("Trailer/" + trailer.getId() + "/" + image.getOriginalFilename());
        multimediaRepository.save(multimedia);

        if (!image.isEmpty()) {
            try {
                byte[] bytesImagen = image.getBytes();
                Path rutaCarpeta = Paths.get("src/main/resources/public/imgServidor/Trailer/" + trailer.getId() + "/");
                if (!Files.exists(rutaCarpeta)) {
                    Files.createDirectories(rutaCarpeta);
                }
                Path rutaFinal = Paths.get("src/main/resources/public/imgServidor/Trailer/" + trailer.getId() + "/" + image.getOriginalFilename());
                Files.write(rutaFinal, bytesImagen);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    public void actualizarTrailer(Long id,TrailerRequest trailerRequest, MultipartFile image, List<Long> directors, List<Long> actors) throws IOException {
        Trailer trailer = findTrailerById(id);
        Multimedia multimedia = trailer.getMultimedia();
        List<Persona> directorEntities = (List<Persona>) personaRepository.findAllById(directors);
        List<Persona> actorEntities = (List<Persona>) personaRepository.findAllById(actors);

        multimedia.setActors(actorEntities);
        multimedia.setCreators(directorEntities);
        multimedia.setTitle(trailerRequest.getTitle());
        multimedia.setDescription(trailerRequest.getDescription());
        multimedia.setUrl(trailerRequest.getUrl());
        if(image != null){
            if (!image.isEmpty()) {
                multimedia.setImgURL("Trailer/" + trailer.getId() + "/" + image.getOriginalFilename());
                String carpetaImagenes = "src/main/resources/public/imgServidor/Trailer/" + trailer.getId();
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
                    Path rutaCarpeta = Paths.get("src/main/resources/public/imgServidor/Trailer/"+trailer.getId()+"/");
                    if (!Files.exists(rutaCarpeta)) {
                        Files.createDirectories(rutaCarpeta);
                    }
                    Path rutaFinal = Paths.get("src/main/resources/public/imgServidor/Trailer/"+trailer.getId()+"/"+image.getOriginalFilename());
                    Files.write(rutaFinal, bytesImagen);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        multimediaRepository.save(multimedia);
        trailerRepository.save(trailer);
    }
    public void eliminarTrailer(Long id) throws IOException {
        Trailer trailer = findTrailerById(id);
        Multimedia multimedia = trailer.getMultimedia();
        String carpetaImagenes = "src/main/resources/public/imgServidor/Trailer/" + trailer.getId();
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
        trailerRepository.delete(trailer);
        multimediaRepository.delete(multimedia);
    }
}
