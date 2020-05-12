package com.project78.graph.repository;

import com.project78.graph.entity.Subject;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;
import org.neo4j.ogm.model.Result;

import java.util.List;

public interface SubjectRepository extends Neo4jRepository<Subject,Long> {

    Subject findById(long id);

    @Query("match (n:Person {username : $username})-[r:READ_MESSAGE]-(s:Subject) return s")
    List<Subject> allReadMessages(@Param("username") String username);

    @Query("MATCH  (n:Person )-[r:READ_MESSAGE]->(s:Subject)\n" +
            "WHERE NOT (n:Person {username : $username})-[r:READ_MESSAGE]->(s:Subject)\n" +
            "RETURN s")
    List<Subject> allUnreadMessages(@Param("username") String username);

    @Query("match (n:Person {username : $username})-[r:LIKED_MESSAGE]-(s:Subject) return s, type(r) AS relationship")
    Result allLikedMessages(@Param("username") String username);


//    @Query("MATCH  (p:Person {username: $username}), (b:Subject {uuid: $uuid}) \n" +
//            "RETURN EXISTS( (p)-[:READ_MESSAGE]-(b) )")
//    boolean checkReadMessageRelation(@Param("username") String username, @Param("uuid") String uuid);
//
//
//    @Query("MATCH  (p:Person {username: $username}), (b:Subject {uuid: $uuid}) \n" +
//            "RETURN EXISTS( (p)-[:LIKED_MESSAGE]-(b) )")
//    boolean checkLikedMessageRelation(@Param("username") String username, @Param("uuid") String uuid);

    @Query("MATCH (a:Person),(b:Subject)\n" +
            "WHERE a.username = $username AND b.uuid = $uuid\n" +
            "MERGE (a)-[r:READ_MESSAGE]->(b)\n" +
            "RETURN type(r)")
    List<Subject> createRelationship(@Param("username") String username, @Param("uuid") String uuid);


    @Query("MATCH (a:Person),(b:Subject)\n" +
            "WHERE a.username = $username AND b.uuid = $uuid\n" +
            "CREATE (a)-[r:MESSAGE_POSTED_BY]->(b)\n" +
            "RETURN type(r)")
    List<Subject> createPostedByRelation(@Param("username") String username, @Param("uuid") String uuid);

    @Query("MATCH (a:Person),(b:Subject)\n" +
            "WHERE a.username = $username AND b.uuid = $uuid\n" +
            "MERGE (a)-[r:LIKED_MESSAGE]->(b)\n" +
            "RETURN type(r)")
    List<Subject> createLikedRelation(@Param("username") String username, @Param("uuid") String uuid);
//
//    @Query("MATCH (a:Subject { uuid: $uuid})<-[:MESSAGE_POSTED_BY]-(b)\n" +
//            "    RETURN b.username")
//    String getPostedBy(@Param("uuid") String uuid);



}
