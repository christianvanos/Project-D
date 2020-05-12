package com.project78.graph.entity;

import lombok.Data;
import org.apache.commons.lang3.ArrayUtils;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;

import java.util.ArrayList;
import java.util.Arrays;

@Data
@NodeEntity
public class SubjectName {
    @Id
    @GeneratedValue
    private Long id;

    private ArrayList<String> subjectNamesList = new ArrayList<String>();

    public ArrayList<String> getSubjectNamesList() {
        return subjectNamesList;
    }

    public void addSubject(String subject) {
        subjectNamesList.add(subject);
    }

}
