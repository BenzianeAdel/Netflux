package com.netflux.backend.controller;

import com.netflux.backend.controller.Responses.*;
import com.netflux.backend.model.*;
import com.netflux.backend.service.MultimediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@CrossOrigin(origins = "*")
public class MultimediaController {

    @Autowired
    MultimediaService multimediaService;

    @GetMapping("/multimedias/{id}")
    @ResponseBody
    public ResponseEntity<?> getMultimediaWithId(@PathVariable("id") Long idMultimedia){
        Multimedia multimediaBD = multimediaService.findMultimediaById(idMultimedia);

        if (multimediaBD != null) {
            ResponseMultimedia multimediaResponse = new ResponseMultimedia();
            multimediaResponse.setIdMultimedia(multimediaBD.getId());

            if (multimediaBD.getPelicula() != null) {
                multimediaResponse.setType("pelicula");
            } else if(multimediaBD.getSerie() != null) {
                multimediaResponse.setType("serie");
            } else{
                multimediaResponse.setType("trailer");
            }

            multimediaResponse.setUrl(multimediaBD.getUrl());
            multimediaResponse.setTitle(multimediaBD.getTitle());
            multimediaResponse.setImgURL(multimediaBD.getImgURL());

            return new ResponseEntity<>(multimediaResponse, HttpStatus.OK);
        } else {
            String errorMessage = "Multimedia con ID " + idMultimedia + " no encontrado.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/multimedias")
    @ResponseBody
    public ResponseEntity<?> getMultimediaAll() {
        List<Multimedia> multimediaBD = multimediaService.findMultimediaAll();
        List<ResponseMultimedia> multimediasResponses = new ArrayList<>();

        if (multimediaBD.isEmpty()) {
            String errorMessage = "No se encontraron elementos multimedia.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }

        for (Multimedia m : multimediaBD) {
            ResponseMultimedia multimediaResponse = new ResponseMultimedia();
            multimediaResponse.setIdMultimedia(m.getId());

            if (m.getPelicula() != null) {
                multimediaResponse.setType("pelicula");
            } else if(m.getSerie() != null){
                multimediaResponse.setType("serie");
            } else{
                multimediaResponse.setType("trailer");
            }
            multimediaResponse.setUrl(m.getUrl());
            multimediaResponse.setTitle(m.getTitle());
            multimediaResponse.setImgURL(m.getImgURL());
            multimediasResponses.add(multimediaResponse);
        }
        return new ResponseEntity<>(multimediasResponses, HttpStatus.OK);
    }
    @GetMapping("/destacados")
    @ResponseBody
    public ResponseEntity<?> getDestacados() {
        List<Multimedia> multimediaBD = multimediaService.findMultimediaAll();

        if (multimediaBD.isEmpty()) {
            String errorMessage = "No se encontraron elementos multimedia destacados.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }
        List<ResponseDestacados> destacadosResponses = new ArrayList<>();

        for (Multimedia m : multimediaBD) {
            if (m.getPelicula() !=null  && m.getPelicula().isDestacada()) {
                ResponseDestacados destacadoResponse = new ResponseDestacados();
                destacadoResponse.setIdMultimedia(m.getId());
                destacadoResponse.setType("pelicula");
                destacadoResponse.setId(m.getPelicula().getId());
                destacadoResponse.setUrl(m.getUrl());
                destacadoResponse.setTitle(m.getTitle());
                destacadoResponse.setImgURL(m.getImgURL());
                destacadosResponses.add(destacadoResponse);
            } else if(m.getSerie() != null && m.getSerie().isDestacada()) {
                ResponseDestacados destacadoResponse = new ResponseDestacados();
                destacadoResponse.setIdMultimedia(m.getId());
                destacadoResponse.setType("serie");
                destacadoResponse.setId(m.getSerie().getId());
                destacadoResponse.setUrl(m.getUrl());
                destacadoResponse.setTitle(m.getTitle());
                destacadoResponse.setImgURL(m.getImgURL());
                destacadosResponses.add(destacadoResponse);
            }
        }
        return new ResponseEntity<>(destacadosResponses, HttpStatus.OK);
    }
}
