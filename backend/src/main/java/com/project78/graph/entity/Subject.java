package com.project78.graph.entity;

import lombok.Data;
import org.neo4j.ogm.annotation.*;

import java.util.ArrayList;
import java.util.Date;

@Data
@NodeEntity
public class Subject {

    @Id
    @GeneratedValue
    private Long id;

    private String uuid;

    private String title;

    public String getUUID() {
        return uuid;
    }

    public void setUUID(String uuid) {
        this.uuid = uuid;
    }

    public Long getId() {
        return id;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    private String subjectName;

    private String level;

    private String message;

    private String datetimePosted;

    @Relationship(type = MessageRead.TYPE, direction = Relationship.INCOMING)
    private ArrayList<Subject> messageList = new ArrayList<>();

    @Override
    public String toString() {
        return "Subject{" +
                "id=" + id +
                ", UUID='" + uuid + '\'' +
                ", subjectName='" + subjectName + '\'' +
                ", title='" + title + '\'' +
                ", level='" + level + '\'' +
                ", message='" + message + '\'' +
                ", datetimePosted='" + datetimePosted + '\'' +
                ", messageList=" + messageList +
                '}';
    }
}
