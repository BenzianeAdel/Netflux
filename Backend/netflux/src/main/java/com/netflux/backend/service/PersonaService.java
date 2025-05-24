package com.netflux.backend.service;

import com.netflux.backend.controller.Requests.PersonaRequest;
import com.netflux.backend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;

@Service
public class PersonaService {
    @Autowired
    PersonaRepository personaRepository;

    @Autowired
    MultimediaRepository multimediaRepository;

    public Persona findPersonaById(Long personaId) {
        return personaRepository.findById(personaId).orElse(null);
    }
    public List<Persona> findPersonasAll() {
        return (List<Persona>) personaRepository.findAll();
    }

    public void crearPersona(PersonaRequest personaRequest, MultipartFile image) throws IOException {
        Persona persona = new Persona();
        persona.setNombre(personaRequest.getNombre());
        personaRepository.save(persona);
        persona.setImgURL("Actores/" + persona.getId() + "/" + image.getOriginalFilename());
        personaRepository.save(persona);

        if (!image.isEmpty()) {
            try {
                byte[] bytesImagen = image.getBytes();
                Path rutaCarpeta = Paths.get("src/main/resources/public/imgServidor/Actores/" + persona.getId() + "/");
                if (!Files.exists(rutaCarpeta)) {
                    Files.createDirectories(rutaCarpeta);
                }
                Path rutaFinal = Paths.get("src/main/resources/public/imgServidor/Actores/" + persona.getId() + "/" + image.getOriginalFilename());
                Files.write(rutaFinal, bytesImagen);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    public void actualizarPersona(Long id,PersonaRequest personaRequest, MultipartFile image) throws IOException {
        Persona persona = findPersonaById(id);
        persona.setNombre(personaRequest.getNombre());
        if(image != null){
            if (!image.isEmpty()) {
                persona.setImgURL("Actores/" + persona.getId() + "/" + image.getOriginalFilename());
                String carpetaImagenes = "src/main/resources/public/imgServidor/Actores/" + persona.getId();
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
                    Path rutaCarpeta = Paths.get("src/main/resources/public/imgServidor/Actores/"+persona.getId()+"/");
                    if (!Files.exists(rutaCarpeta)) {
                        Files.createDirectories(rutaCarpeta);
                    }
                    Path rutaFinal = Paths.get("src/main/resources/public/imgServidor/Actores/"+persona.getId()+"/"+image.getOriginalFilename());
                    Files.write(rutaFinal, bytesImagen);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        personaRepository.save(persona);
    }
    public void eliminarPersona(Long id) throws IOException {
        Persona persona = findPersonaById(id);
        List<Multimedia> multimedias = (List<Multimedia>) multimediaRepository.findAll();

        String carpetaImagenes = "src/main/resources/public/imgServidor/Actores/" + persona.getId();
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
        for(Multimedia m : multimedias){
            m.getActors().removeIf(actor -> actor.getId().equals(persona.getId()));
            m.getCreators().removeIf(creator -> creator.getId().equals(persona.getId()));
            multimediaRepository.save(m);
        }

        personaRepository.delete(persona);
    }
}
