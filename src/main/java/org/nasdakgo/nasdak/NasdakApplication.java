package org.nasdakgo.nasdak;

import org.nasdakgo.nasdak.Config.YamlPropertySourceFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@PropertySource(value = {"classpath:local/apiKey.yml","classpath:category.yml"}, factory = YamlPropertySourceFactory.class)
public class NasdakApplication {

    public static void main(String[] args) {
        SpringApplication.run(NasdakApplication.class, args);
    }

}
