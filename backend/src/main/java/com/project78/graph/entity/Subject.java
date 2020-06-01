package com.project78.graph.entity;

import lombok.Data;
import org.neo4j.ogm.annotation.*;
import com.project78.graph.entity.Subject;

import java.text.SimpleDateFormat;
import java.text.DateFormat;
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

    public Date getDatetimePosted() {
       return datetimePosted;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }



    public String getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(String postedBy) {
        this.postedBy = postedBy;
    }


    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean value) {
        this.liked = value;
    }


    public boolean isRead() {
        return read;
    }
    public void setRead(boolean value) {
        this.read = value;
    }


    public void setDatetimePosted() {
        this.datetimePosted = new Date();
    }




    private String subjectName;

    private String level;

    private String message;
    private boolean read;
    private boolean liked;

    private Date datetimePosted;
    private String postedBy;



    @Relationship(type = MessagePosted.TYPE, direction = Relationship.INCOMING)
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
                ", datetimePosted='" + datetimePosted.toString() + '\'' +
                ", postedBy='" + postedBy + '\'' +
                ", liked='" + liked + '\'' +
                ", read='" + read + '\'' +
                ", messageList=" + messageList +
                '}';
    }
}
