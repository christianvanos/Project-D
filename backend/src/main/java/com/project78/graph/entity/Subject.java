package com.project78.graph.entity;

import lombok.Data;
import org.neo4j.ogm.annotation.*;
import java.util.ArrayList;

@Data
@NodeEntity
public class Subject {
    @Id
    @GeneratedValue
    private Long id;

    @Property
    private String subjectName;

    @Property
    private Integer priority;

    @Property
    private String message;

    @Relationship(type = MessageRead.TYPE, direction = Relationship.INCOMING)
    private ArrayList<Subject> messageList = new ArrayList<>();
}
