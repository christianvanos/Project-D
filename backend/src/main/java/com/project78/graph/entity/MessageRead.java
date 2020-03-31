package com.project78.graph.entity;

import lombok.Data;
import org.neo4j.ogm.annotation.*;

@Data
@RelationshipEntity(type = MessageRead.TYPE)
public class MessageRead {
    public static final String TYPE = "READ_MESSAGE";

    @Id
    @GeneratedValue
    private  Long id;

    @StartNode
    private Person person;

    @EndNode
    private Subject subject;
}
