package com.project78.graph.repository;

import com.project78.graph.entity.MessageRead;
import com.project78.graph.entity.Person;
import com.project78.graph.entity.Subject;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface LinkedRelationshipRepository extends Neo4jRepository<MessageRead,Long> {


}
