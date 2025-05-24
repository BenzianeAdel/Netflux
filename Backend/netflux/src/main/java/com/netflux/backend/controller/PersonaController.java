package com.netflux.backend.controller;

import com.netflux.backend.controller.Requests.PersonaRequest;
import com.netflux.backend.controller.Responses.ResponsePelicula;
import com.netflux.backend.model.Pelicula;
import com.netflux.backend.model.Persona;
import com.netflux.backend.service.PersonaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@CrossOrigin(origins = "*")
public class PersonaController {

    @Autowired
    PersonaService personaService;

    @GetMapping("/personas")
    @ResponseBody
    public List<Persona> personasList(){
        List<Persona> personas = personaService.findPersonasAll();
        return personas;
    }
    @PostMapping("/personas")
    public ResponseEntity<String> crearPersona(@ModelAttribute PersonaRequest personaRequest,
                                                @RequestParam("image") MultipartFile image) {
        try {
            personaService.crearPersona(personaRequest, image);

            return new ResponseEntity<>("Persona creada con éxito", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear la persona: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/personas/{id}")
    public ResponseEntity<String> actualizarPersona(@PathVariable("id") Long id,@ModelAttribute PersonaRequest personaRequest,
                                                     @RequestParam(value = "image",required = false) MultipartFile image) {
        try {
            personaService.actualizarPersona(id,personaRequest, image);
            return new ResponseEntity<>("Cambios guardados con éxito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar cambios: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/personas/{id}")
    public ResponseEntity<String> eliminarPersona(@PathVariable("id") Long id) {
        try {
            personaService.eliminarPersona(id);
            return new ResponseEntity<>("Persona eliminada con éxito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar persona: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/personas/{id}")
    @ResponseBody
    public Persona getPersonaWithId(@PathVariable("id") Long idPersona) {
        Persona personaBD = personaService.findPersonaById(idPersona);
        return personaBD;
    }
}
