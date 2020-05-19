package com.project78.graph.model;

import com.project78.graph.entity.Subject;
import com.project78.graph.entity.Person;

public class SubjectPerson {
    private Subject subject;
    private Person person;

    public Person getPerson(){
        return person;
    }
    public Subject getSubject(){
        return subject;
    }

    public Subject setSubject(Subject subject){
        return this.subject = subject;
    }
    public Person setPerson(Person person){
        return this.person = person;
    }

    public String toString() {
        return "SubjectPerson{" +
                "subject=" + subject + '\'' +
                "person=" + person + '\'' +
                "}";
    }
}
