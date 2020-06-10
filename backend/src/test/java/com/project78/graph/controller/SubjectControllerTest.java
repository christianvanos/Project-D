package com.project78.graph.controller;

import com.project78.graph.entity.Subject;
import com.project78.graph.entity.SubjectName;
import com.project78.graph.model.Messages;
import com.project78.graph.model.Relationship;
import com.project78.graph.model.SubjectPerson;
import com.project78.graph.repository.SubjectNameRepository;
import com.project78.graph.repository.SubjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SubjectControllerTest {

    private SubjectController subjectControllerUnderTest;

    @BeforeEach
    void setUp() {
        subjectControllerUnderTest = new SubjectController();
        subjectControllerUnderTest.subjectRepository = mock(SubjectRepository.class);
        subjectControllerUnderTest.subjectNameRepository = mock(SubjectNameRepository.class);
    }

    @Test
    void testIsFeedUpdated() {
        // Setup

        // Run the test
        final boolean result = subjectControllerUnderTest.isFeedUpdated("datetime");

        // Verify the results
        assertFalse(result);
    }

    @Test
    void testGetFeedUpdate() {
        // Setup

        // Configure SubjectRepository.getSubjectsSinceDatetime(...).
        final Subject subject = new Subject();
        subject.setUUID("uuid");
        subject.setSubjectName("subjectName");
        subject.setLevel("level");
        subject.setMessage("message");
        subject.setTitle("title");
        subject.setPostedBy("postedBy");
        subject.setLiked(false);
        subject.setRead(false);
        final List<Subject> subjects = Arrays.asList(subject);
        when(subjectControllerUnderTest.subjectRepository.getSubjectsSinceDatetime(new GregorianCalendar(2019, Calendar.JANUARY, 1).getTime())).thenReturn(subjects);

        // Run the test
        final List<Subject> result = subjectControllerUnderTest.getFeedUpdate("datetime");

        // Verify the results
    }

    @Test
    void testGetUnreadHighLevelMessages() {
        // Setup

        // Configure SubjectRepository.allUnreadHighLevelMessages(...).
        final Subject subject = new Subject();
        subject.setUUID("uuid");
        subject.setSubjectName("subjectName");
        subject.setLevel("level");
        subject.setMessage("message");
        subject.setTitle("title");
        subject.setPostedBy("postedBy");
        subject.setLiked(false);
        subject.setRead(false);
        final List<Subject> subjects = Arrays.asList(subject);
        when(subjectControllerUnderTest.subjectRepository.allUnreadHighLevelMessages("username")).thenReturn(subjects);

        // Run the test
        final List<Subject> result = subjectControllerUnderTest.getUnreadHighLevelMessages("username");

        // Verify the results
    }

    @Test
    void testCreateRelationshipBetweenExistingNodes() {
        // Setup
        final Relationship relationship = new Relationship();
        relationship.setUsername("username");
        relationship.setUUID("UUID");
        relationship.setRelation("relation");

        // Configure SubjectRepository.createRelationship(...).
        final Subject subject = new Subject();
        subject.setUUID("uuid");
        subject.setSubjectName("subjectName");
        subject.setLevel("level");
        subject.setMessage("message");
        subject.setTitle("title");
        subject.setPostedBy("postedBy");
        subject.setLiked(false);
        subject.setRead(false);
        final List<Subject> subjects = Arrays.asList(subject);
        when(subjectControllerUnderTest.subjectRepository.createRelationship("username", "uuid")).thenReturn(subjects);

        // Configure SubjectRepository.createPostedByRelation(...).
        final Subject subject1 = new Subject();
        subject1.setUUID("uuid");
        subject1.setSubjectName("subjectName");
        subject1.setLevel("level");
        subject1.setMessage("message");
        subject1.setTitle("title");
        subject1.setPostedBy("postedBy");
        subject1.setLiked(false);
        subject1.setRead(false);
        final List<Subject> subjects1 = Arrays.asList(subject1);
        when(subjectControllerUnderTest.subjectRepository.createPostedByRelation("username", "uuid")).thenReturn(subjects1);

        // Configure SubjectRepository.createLikedRelation(...).
        final Subject subject2 = new Subject();
        subject2.setUUID("uuid");
        subject2.setSubjectName("subjectName");
        subject2.setLevel("level");
        subject2.setMessage("message");
        subject2.setTitle("title");
        subject2.setPostedBy("postedBy");
        subject2.setLiked(false);
        subject2.setRead(false);
        final List<Subject> subjects2 = Arrays.asList(subject2);
        when(subjectControllerUnderTest.subjectRepository.createLikedRelation("username", "uuid")).thenReturn(subjects2);

        // Run the test
        final ResponseEntity result = subjectControllerUnderTest.createRelationshipBetweenExistingNodes(relationship);

        // Verify the results
    }

    @Test
    void testDeleteRelationshipBetweenExistingNodes() {
        // Setup
        final Relationship relationship = new Relationship();
        relationship.setUsername("username");
        relationship.setUUID("UUID");
        relationship.setRelation("relation");

        // Configure SubjectRepository.deleteLikedRelation(...).
        final Subject subject = new Subject();
        subject.setUUID("uuid");
        subject.setSubjectName("subjectName");
        subject.setLevel("level");
        subject.setMessage("message");
        subject.setTitle("title");
        subject.setPostedBy("postedBy");
        subject.setLiked(false);
        subject.setRead(false);
        final List<Subject> subjects = Arrays.asList(subject);
        when(subjectControllerUnderTest.subjectRepository.deleteLikedRelation("username", "uuid")).thenReturn(subjects);

        // Run the test
        final ResponseEntity result = subjectControllerUnderTest.deleteRelationshipBetweenExistingNodes(relationship);

        // Verify the results
    }

    @Test
    void testGetLikedMessages() {
        // Setup
        when(subjectControllerUnderTest.subjectRepository.getLikedMessage("username", "uuid")).thenReturn(0);

        // Run the test
        final Boolean result = subjectControllerUnderTest.getLikedMessages("username", "uuid");

        // Verify the results
        assertFalse(result);
    }

    @Test
    void testGet2() {
        // Setup
        final List<String> expectedResult = Arrays.asList();
        when(subjectControllerUnderTest.subjectNameRepository.count()).thenReturn(0L);

        // Configure SubjectNameRepository.save(...).
        final SubjectName subjectName = new SubjectName();
        when(subjectControllerUnderTest.subjectNameRepository.save(any(SubjectName.class))).thenReturn(subjectName);

        // Configure SubjectNameRepository.findAll(...).
        final SubjectName subjectName1 = new SubjectName();
        final Iterable<SubjectName> subjectNames = Arrays.asList(subjectName1);
        when(subjectControllerUnderTest.subjectNameRepository.findAll()).thenReturn(subjectNames);

        // Run the test
        final List<String> result = subjectControllerUnderTest.get();

        // Verify the results
        assertEquals(expectedResult, result);
    }

    @Test
    void testAddSubject() {
        // Setup

        // Configure SubjectNameRepository.findAll(...).
        final SubjectName subjectName = new SubjectName();
        final Iterable<SubjectName> subjectNames = Arrays.asList(subjectName);
        when(subjectControllerUnderTest.subjectNameRepository.findAll()).thenReturn(subjectNames);

        // Configure SubjectNameRepository.save(...).
        final SubjectName subjectName1 = new SubjectName();
        when(subjectControllerUnderTest.subjectNameRepository.save(any(SubjectName.class))).thenReturn(subjectName1);

        // Run the test
        final ResponseEntity result = subjectControllerUnderTest.addSubject("subject");

        // Verify the results
    }
}
