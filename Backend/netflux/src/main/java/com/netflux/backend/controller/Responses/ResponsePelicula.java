package com.netflux.backend.controller.Responses;

import com.netflux.backend.model.Persona;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ResponsePelicula {
    private Long id;
    private String url;
    private String imgURL;
    private String title;
    private String description;
    private Integer year=0;
    private Integer duration=0;

    private boolean destacada= false;
    private List<Persona> director;
    private List<Persona> cast;
}
