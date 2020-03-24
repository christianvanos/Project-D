package com.project78.graph.entity;

import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import java.util.ArrayList;

@NodeEntity
public class Person {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String username;

    private String password;

    @Relationship(type = "READ_MESSAGE")
    private ArrayList<Subject> subjectList = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public ArrayList<Subject> getSubjectList() {
        return subjectList;
    }

    public void readMessage(Subject subject) {
        this.subjectList.add(subject);
    }

    public void deleteLinkedMessage(Subject subject) {
        this.subjectList.remove(subject);
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", subjectList=" + subjectList +
                '}';
    }
}
