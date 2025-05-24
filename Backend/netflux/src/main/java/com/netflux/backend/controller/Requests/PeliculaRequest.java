package com.netflux.backend.controller.Requests;

public class PeliculaRequest {
    private String url;
    private String title;
    private String description;
    private Integer year;
    private Integer duration;

    private boolean destacada;


    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public boolean getDestacada(){
        return destacada;
    }
    public void setDestacada(boolean destacada){
        this.destacada = destacada;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }
}

