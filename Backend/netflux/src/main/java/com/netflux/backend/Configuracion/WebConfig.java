package com.netflux.backend.Configuracion;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        WebMvcConfigurer.super.addResourceHandlers(registry);

        String currentWorkingDirectory = System.getProperty("user.dir");
        String relativePath = "src/main/resources/public/imgServidor/";

        registry.addResourceHandler("/imgServidor/**")
                .addResourceLocations("file:" + currentWorkingDirectory + "/" + relativePath);
    }
}
