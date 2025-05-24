package com.netflux.backend.controller.Requests;

public class SerieRequest {
    private String url;
    private String title;
    private String description;
    private Integer yearStart;

    private Integer yearEnd;
    private Integer seasons;

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

    public Integer getYearStart() {
        return yearStart;
    }

    public void setYearStart(Integer year) {
        this.yearStart = year;
    }
    public Integer getYearEnd() {
        return yearEnd;
    }

    public void setYearEnd(Integer year) {
        this.yearEnd = year;
    }

    public boolean getDestacada(){
        return destacada;
    }
    public void setDestacada(boolean destacada){
        this.destacada = destacada;
    }

    public Integer getSeasons() {
        return seasons;
    }

    public void setSeasons(Integer seasons) {
        this.seasons = seasons;
    }
}
