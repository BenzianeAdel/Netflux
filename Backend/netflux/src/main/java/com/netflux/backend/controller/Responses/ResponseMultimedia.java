package com.netflux.backend.controller.Responses;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ResponseMultimedia {
    private Long idMultimedia;
    private String type;
    private String url;
    private String title;
    private String imgURL;
}
