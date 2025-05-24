package com.netflux.backend.service;

import com.netflux.backend.controller.Requests.SerieRequest;
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
public class SerieService {
    @Autowired
    SerieRepository serieRepository;

    @Autowired
    MultimediaRepository multimediaRepository;
    @Autowired
    PersonaRepository personaRepository;
    public Serie findSerieById(Long serieId) {
        return serieRepository.findById(serieId).orElse(null);
    }
    public List<Serie> findSerieAll() {
        return (List<Serie>) serieRepository.findAll();
    }

    public void crearSerie(SerieRequest serieRequest, MultipartFile image, List<Long> directors, List<Long> actors) throws IOException {
        Serie serie = new Serie();
        Multimedia multimedia = new Multimedia();
        serie.setSeasons(serieRequest.getSeasons());
        serie.setDestacada(serieRequest.getDestacada());
        serie.setYearStart(serieRequest.getYearStart());
        serie.setYearEnd(serieRequest.getYearEnd());
        List<Persona> directorEntities = (List<Persona>) personaRepository.findAllById(directors);
        List<Persona> actorEntities = (List<Persona>) personaRepository.findAllById(actors);

        multimedia.setActors(actorEntities);
        multimedia.setCreators(directorEntities);
        multimedia.setTitle(serieRequest.getTitle());
        multimedia.setDescription(serieRequest.getDescription());
        multimedia.setCreationDate(LocalDate.now());
        multimedia.setUrl(serieRequest.getUrl());
        serie.setMultimedia(multimedia);
        multimediaRepository.save(multimedia);
        serieRepository.save(serie);
        multimedia.setImgURL("Series/" + serie.getId() + "/" + image.getOriginalFilename());
        multimediaRepository.save(multimedia);

        if (!image.isEmpty()) {
            try {
                byte[] bytesImagen = image.getBytes();
                Path rutaCarpeta = Paths.get("src/main/resources/public/imgServidor/Series/" + serie.getId() + "/");
                if (!Files.exists(rutaCarpeta)) {
                    Files.createDirectories(rutaCarpeta);
                }
                Path rutaFinal = Paths.get("src/main/resources/public/imgServidor/Series/" + serie.getId() + "/" + image.getOriginalFilename());
                Files.write(rutaFinal, bytesImagen);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    public void actualizarSerie(Long id,SerieRequest serieRequest, MultipartFile image, List<Long> directors, List<Long> actors) throws IOException {
        Serie serie = findSerieById(id);
        Multimedia multimedia = serie.getMultimedia();
        serie.setSeasons(serieRequest.getSeasons());
        serie.setDestacada(serieRequest.getDestacada());
        serie.setYearStart(serieRequest.getYearStart());
        serie.setYearEnd(serieRequest.getYearEnd());
        List<Persona> directorEntities = (List<Persona>) personaRepository.findAllById(directors);
        List<Persona> actorEntities = (List<Persona>) personaRepository.findAllById(actors);

        multimedia.setActors(actorEntities);
        multimedia.setCreators(directorEntities);
        multimedia.setTitle(serieRequest.getTitle());
        multimedia.setDescription(serieRequest.getDescription());
        multimedia.setUrl(serieRequest.getUrl());
        if(image != null){
            if (!image.isEmpty()) {
                multimedia.setImgURL("Series/" + serie.getId() + "/" + image.getOriginalFilename());
                String carpetaImagenes = "src/main/resources/public/imgServidor/Series/" + serie.getId();
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
                    Path rutaCarpeta = Paths.get("src/main/resources/public/imgServidor/Series/"+serie.getId()+"/");
                    if (!Files.exists(rutaCarpeta)) {
                        Files.createDirectories(rutaCarpeta);
                    }
                    Path rutaFinal = Paths.get("src/main/resources/public/imgServidor/Series/"+serie.getId()+"/"+image.getOriginalFilename());
                    Files.write(rutaFinal, bytesImagen);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        multimediaRepository.save(multimedia);
        serieRepository.save(serie);
    }
    public void eliminarSerie(Long id) throws IOException {
        Serie serie = findSerieById(id);
        Multimedia multimedia = serie.getMultimedia();
        String carpetaImagenes = "src/main/resources/public/imgServidor/Series/" + serie.getId();
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
        serieRepository.delete(serie);
        multimediaRepository.delete(multimedia);
    }


}
