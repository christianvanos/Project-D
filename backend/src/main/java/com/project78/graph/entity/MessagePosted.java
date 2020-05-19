package com.project78.graph.entity;

import lombok.Data;
import org.neo4j.ogm.annotation.*;

@Data
@RelationshipEntity(type = MessagePosted.TYPE)
public class MessagePosted {
    public static final String TYPE = "MESSAGE_POSTED_BY";

    @Id
    @GeneratedValue
    private  Long id;

    @StartNode
    private Person person;

    @EndNode
    private Subject subject;
}
