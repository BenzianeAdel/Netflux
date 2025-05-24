package com.netflux.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;

@Getter
@Setter
@Entity
@Table(name = "series")
public class Serie {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer yearStart;
    private Integer yearEnd;
    private Integer seasons;

    private boolean destacada = false;
    @OneToOne
    @JoinColumn(name = "fk_multimedia")
    private Multimedia multimedia;
}
