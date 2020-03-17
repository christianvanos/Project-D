package com.project78.graph.repository;

import com.project78.graph.entity.Subject;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface SubjectRepository extends Neo4jRepository<Subject,Long> {

    Subject findById(long id);

}
