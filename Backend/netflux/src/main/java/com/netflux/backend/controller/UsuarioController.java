package com.netflux.backend.controller;

import com.netflux.backend.controller.Requests.UsuarioRequest;
import com.netflux.backend.model.Persona;
import com.netflux.backend.model.Usuario;
import com.netflux.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@CrossOrigin(origins = "*")
public class UsuarioController {
    @Autowired
    UsuarioService usuarioService;
    @PostMapping("/login")
    public ResponseEntity<String> login(@ModelAttribute UsuarioRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        UsuarioService.LoginStatus loginStatus = usuarioService.login(username, password);

        switch (loginStatus) {
            case LOGIN_OK:
                return ResponseEntity.ok("Login exitoso");
            case USER_NOT_FOUND:
                return ResponseEntity.status(404).body("Usuario no encontrado");
            case ERROR_PASSWORD:
                return ResponseEntity.status(401).body("Error de contraseña");
            default:
                return ResponseEntity.status(500).body("Error desconocido");
        }
    }
    @GetMapping("/usuarios")
    @ResponseBody
    public List<Usuario> usuariosList(){
        List<Usuario> usuarios = usuarioService.findUsuariosAll();
        return usuarios;
    }
    @PostMapping("/usuarios")
    public ResponseEntity<String> crearUsuario(@ModelAttribute UsuarioRequest usuarioRequest) {
        try {
            usuarioService.crearUsuario(usuarioRequest);
            return new ResponseEntity<>("Usuario creado con éxito", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear el usuario: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<String> actualizarUsuario(@PathVariable("id") Long id,@ModelAttribute UsuarioRequest usuarioRequest) {
        try {
            usuarioService.actualizarUsuario(id,usuarioRequest);
            return new ResponseEntity<>("Cambios guardados con éxito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar cambios: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable("id") Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return new ResponseEntity<>("Usuario eliminado con éxito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar usuario: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/usuarios/{id}")
    @ResponseBody
    public Usuario getPersonaWithId(@PathVariable("id") Long idUsuario) {
        Usuario usuarioBd = usuarioService.findUsuarioById(idUsuario);
        return usuarioBd;
    }
}
