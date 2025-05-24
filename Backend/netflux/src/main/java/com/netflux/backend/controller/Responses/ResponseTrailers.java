package com.netflux.backend.controller.Responses;

import com.netflux.backend.model.Persona;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ResponseTrailers {
    private Long id;
    private String title;
    private String url;

    private String description;
    private String imgURL;
    private List<Persona> director;
    private List<Persona> cast;
}
