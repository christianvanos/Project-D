package com.project78.graph.model;

import com.project78.graph.entity.Subject;

import java.util.List;

public class Messages {

    private List<Subject> readMassages;
    private List<Subject> UnreadMassages;

    public List<Subject> getReadMassages() {
        return readMassages;
    }

    public List<Subject> getUnreadMassages() {
        return UnreadMassages;
    }


    public Messages(List<Subject> readMassages, List<Subject> unreadMassages) {
        this.readMassages = readMassages;
        this.UnreadMassages = unreadMassages;
    }
}
