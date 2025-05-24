package com.netflux.backend.service;

import com.netflux.backend.controller.Requests.UsuarioRequest;
import com.netflux.backend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
@Service
public class UsuarioService {
    @Autowired
    UsuarioRepository usuarioRepository;
    public enum LoginStatus {LOGIN_OK, USER_NOT_FOUND, ERROR_PASSWORD}

    public Usuario findUsuarioById(Long usuarioId) {
        return usuarioRepository.findById(usuarioId).orElse(null);
    }
    public List<Usuario> findUsuariosAll() {
        return (List<Usuario>) usuarioRepository.findAll();
    }


    public LoginStatus login(String username, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByUsername(username);
        if (!usuario.isPresent()) {
            return LoginStatus.USER_NOT_FOUND;
        } else if (!usuario.get().getPassword().equals(password)) {
            return LoginStatus.ERROR_PASSWORD;
        } else {
            return LoginStatus.LOGIN_OK;
        }
    }

    public void crearUsuario(UsuarioRequest usuarioRequest){
        Usuario usuario = new Usuario();
        usuario.setUsername(usuarioRequest.getUsername());
        usuario.setPassword(usuarioRequest.getPassword());
        usuarioRepository.save(usuario);
    }
    public void actualizarUsuario(Long id,UsuarioRequest usuarioRequest){
        Usuario usuario = findUsuarioById(id);
        usuario.setUsername(usuarioRequest.getUsername());
        usuario.setPassword(usuarioRequest.getPassword());
        usuarioRepository.save(usuario);
    }
    public void eliminarUsuario(Long id) {
        Usuario usuario = findUsuarioById(id);
        usuarioRepository.delete(usuario);
    }
}
