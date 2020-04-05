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

    private String name;

    private String username;

    private String password;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public ArrayList<Subject> getSubjectList() {
        return subjectList;
    }

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
