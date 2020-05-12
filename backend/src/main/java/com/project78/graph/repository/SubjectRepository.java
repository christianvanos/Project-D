package com.project78.graph.repository;

import com.project78.graph.entity.Subject;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubjectRepository extends Neo4jRepository<Subject,Long> {

    Subject findById(long id);

    @Query("match (n:Person {username : $username})-[r:READ_MESSAGE]-(s:Subject) return s")
    List<Subject> allReadMessages(@Param("username") String username);

    @Query("MATCH  (s:Subject)\n" +
            "WHERE NOT (:Person {username : $username})-[:READ_MESSAGE]->(s:Subject) AND s.level = 'High'\n" +
            "RETURN s")
    List<Subject> allUnreadHighLevelMessages(@Param("username") String username);

    @Query("MATCH (a:Person),(b:Subject)\n" +
            "WHERE a.username = $username AND b.uuid = $uuid\n" +
            "CREATE (a)-[r:READ_MESSAGE]->(b)\n" +
            "RETURN type(r)")
    List<Subject> createRelationship(@Param("username") String username, @Param("uuid") String uuid);

    @Query("match (n:Person)-[r:READ_MESSAGE]-(s:Subject {subjectName: {subjectName}}) return count(s)")
    Integer getBarChartData(@Param("subjectName") String subjectName);

    //Match (n)
    //Return n
    //Order by n.created_at desc
    //Limit 7
    //Wanneer code gemerged is kan er gebruik maken van de bovenstaande query om de laatste 7 berichten uit de database te halen
    @Query("Match (n:Subject {level:'High'}) Return n Limit 7")
    List<Subject> getTheLastSevenSubject();

    @Query("MATCH (n:Subject)-[r]-() WHERE n.uuid = {uuid}\n" + "RETURN COUNT(r)")
    Integer getReadCountSubject(@Param("uuid") String uuid);

}
