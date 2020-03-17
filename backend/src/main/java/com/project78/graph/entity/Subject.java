package com.project78.graph.entity;

import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import java.util.ArrayList;

@NodeEntity
public class Subject {

    @Id
    @GeneratedValue
    private  Long id;
    private String subjectName;
    private String message;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public ArrayList<Subject> getMessageList() {
        return messageList;
    }

    public void setMessageList(ArrayList<Subject> messageList) {
        this.messageList = messageList;
    }

    @Relationship(type = "READ_MESSAGE", direction = Relationship.INCOMING)
    private ArrayList<Subject> messageList = new ArrayList<>();
}
