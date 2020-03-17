package com.project78.graph.entity;

import org.neo4j.ogm.annotation.*;

@RelationshipEntity(type = "READ_MESSAGE")
public class MessageRead {
    @Id
    @GeneratedValue
    private  Long id;

    @StartNode
    private Person person;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    @EndNode
    private Subject subject;
}
