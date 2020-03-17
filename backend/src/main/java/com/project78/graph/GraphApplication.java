package com.project78.graph;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;

@SpringBootApplication
public class GraphApplication {

    public static void main(String[] args) {
        SpringApplication.run(GraphApplication.class, args);
    }

}
