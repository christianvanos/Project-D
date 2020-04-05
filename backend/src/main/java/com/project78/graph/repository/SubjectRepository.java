package com.project78.graph.repository;

import com.project78.graph.entity.Subject;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubjectRepository extends Neo4jRepository<Subject,Long> {

    Subject findById(long id);

    @Query("match (n:Person {username : {username}})-[r:READ_MESSAGE]-(s:Subject) return s")
    List<Subject> allReadMessages(@Param("username") String username);

    @Query("MATCH  (n:Person )-[r:READ_MESSAGE]->(s:Subject)\n" +
            "WHERE NOT (n:Person {username : {username}})-[r:READ_MESSAGE]->(s:Subject)\n" +
            "RETURN s")
    List<Subject> allUnreadMessages(@Param("username") String username);

    @Query("MATCH (a:Person),(b:Subject)\n" +
            "WHERE a.username = {username} AND b.uuid = {uuid}\n" +
            "CREATE (a)-[r:READ_MESSAGE]->(b)\n" +
            "RETURN type(r)")
    List<Subject> createRelationship(@Param("username") String username, @Param("uuid") String uuid);

}
