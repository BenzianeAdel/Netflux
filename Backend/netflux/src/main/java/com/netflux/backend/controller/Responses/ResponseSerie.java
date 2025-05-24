package com.netflux.backend.controller.Responses;

import com.netflux.backend.model.Persona;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ResponseSerie {
    private Long id;
    private String url;
    private String imgURL;
    private String title;
    private String description;

    private Integer yearStart=0;
    private Integer yearEnd=0;
    private Integer seasons=0;

    private boolean destacada = false;

    private List<Persona> creators;
    private List<Persona> cast;

}
