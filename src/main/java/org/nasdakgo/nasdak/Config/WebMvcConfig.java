package org.nasdakgo.nasdak.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Configuration
@ComponentScan(basePackages = "Utils")
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${path.front}")
    private String frontBaseUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String localUrl = "http://";
        try {
            String address = InetAddress.getLocalHost().getHostAddress();
            localUrl += address+":3000";
        } catch (UnknownHostException e) {
            throw new RuntimeException(e);
        }
        registry.addMapping("/**")
                .allowedOrigins(frontBaseUrl, localUrl)
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }

    private String connectPath = "/uploadFile/**"; // URL 패턴
    private String resourcePath = "file:///D:/Devspace/uploadFile/"; // 실제 파일 시스템 경로

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(connectPath)
                .addResourceLocations(resourcePath);
    }
}

