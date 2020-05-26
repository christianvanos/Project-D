package com.project78.graph.repository;

import com.project78.graph.entity.Subject;
import com.project78.graph.entity.SubjectName;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface SubjectNameRepository extends Neo4jRepository<SubjectName,Long> {

}
