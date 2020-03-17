package com.project78.graph.repository;

import com.project78.graph.entity.Person;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface PersonRepository extends Neo4jRepository<Person, Long> {

    Person findByName(String name);

    Person findById(long id);

}
