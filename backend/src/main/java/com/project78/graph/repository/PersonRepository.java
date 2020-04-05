package com.project78.graph.repository;

import com.project78.graph.entity.Person;
import com.project78.graph.entity.Subject;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;

import java.util.List;

public interface PersonRepository extends Neo4jRepository<Person, Long> {

    Person findByName(String name);

    Person findById(long id);

    Person findByUsername(String username);

}
