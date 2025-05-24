package com.netflux.backend.service;

import com.netflux.backend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MultimediaService {

    @Autowired
    MultimediaRepository multimediaRepository;


    public Multimedia findMultimediaById(Long multimediaId) {
        return multimediaRepository.findById(multimediaId).orElse(null);
    }
    public List<Multimedia> findMultimediaAll() {
        return (List<Multimedia>) multimediaRepository.findAll();
    }


}
