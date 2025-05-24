package com.netflux.backend.controller.Responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseDestacados {
    private Long idMultimedia;
    private Long id;
    private String type;
    private String url;
    private String title;
    private String imgURL;
}
