package com.netflux.backend.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "multimedias")
@JsonIgnoreProperties(value = {"serie","pelicula"})
public class Multimedia implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String url;
    private String imgURL;
    private String title;
    private String description;

    @Column(name = "creation_date")
    private LocalDate creationDate;


    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinTable(name = "multimedia_creators",
            joinColumns = { @JoinColumn(name = "fk_multimedia") },
            inverseJoinColumns = {@JoinColumn(name = "fk_creators")}
    )
    List<Persona> creators = new ArrayList<>();


    @ManyToMany(fetch = FetchType.EAGER ,cascade = CascadeType.REMOVE)
    @JoinTable(name = "multimedia_actors",
            joinColumns = { @JoinColumn(name = "fk_multimedia") },
            inverseJoinColumns = {@JoinColumn(name = "fk_actors")}
    )
    List<Persona> actors = new ArrayList<>();

    @OneToOne(mappedBy = "multimedia", cascade = CascadeType.ALL)
    private Serie serie;
    @OneToOne(mappedBy = "multimedia", cascade = CascadeType.ALL)
    private Pelicula pelicula;

    @OneToOne(mappedBy = "multimedia", cascade = CascadeType.ALL)
    private Trailer trailer;


}
