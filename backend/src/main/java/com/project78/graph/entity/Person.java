package com.project78.graph.entity;

import lombok.Data;
import org.neo4j.ogm.annotation.*;

import java.util.ArrayList;

@Data
@NodeEntity
public class Person {
    @Id
    @GeneratedValue
    private Long id;

    @Property
    private String name;

    @Property
    private String username;

    @Property
    private String password;

    @Property
    private String role;

    @Relationship(type = MessageRead.TYPE)
    private ArrayList<Subject> subjectList = new ArrayList<>();

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", subjectList=" + subjectList +
                '}';
    }

    public void readMessage(Subject subject) {
        this.subjectList.add(subject);
    }

    public void deleteLinkedMessage(Subject subject) {
        this.subjectList.remove(subject);
    }
}
