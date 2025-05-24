package com.netflux.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;

@Getter
@Setter
@Entity
@Table(name = "peliculas")
public class Pelicula implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer yearRelease;
    private Integer durationMinutes;

    private boolean destacada = false;
    @OneToOne
    @JoinColumn(name = "fk_multimedia")
    private Multimedia multimedia;

}
