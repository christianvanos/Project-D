package com.project78.graph.controller;

import com.project78.graph.entity.Subject;
import com.project78.graph.entity.SubjectName;
import com.project78.graph.model.RadarChartData;
import com.project78.graph.repository.SubjectNameRepository;
import com.project78.graph.repository.SubjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.initMocks;

class AnalyticsControllerTest {

    @Mock
    private SubjectRepository mockSubjectRepository;
    @Mock
    private SubjectNameRepository mockSubjectNameRepository;

    @InjectMocks
    private AnalyticsController analyticsControllerUnderTest;

    @BeforeEach
    void setUp() {
        initMocks(this);
    }

    @Test
    void testGet() {
        // Setup

        // Configure SubjectRepository.findAll(...).
        final Subject subject = new Subject();
        subject.setUUID("uuid");
        subject.setSubjectName("subjectName");
        subject.setLevel("level");
        subject.setMessage("message");
        subject.setTitle("title");
        subject.setPostedBy("postedBy");
        subject.setLiked(false);
        subject.setRead(false);
        final Iterable<Subject> subjects = Arrays.asList(subject);
        when(mockSubjectRepository.findAll()).thenReturn(subjects);

        when(mockSubjectRepository.getBarChartData("subjectName")).thenReturn(0);

        // Run the test
        final ArrayList<Map<String, Object>> result = analyticsControllerUnderTest.get();

        // Verify the results
    }

    @Test
    void testGetCountOfImportantMessageRead() {
        // Setup

        // Configure SubjectRepository.getTheLastSevenSubject(...).
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
        when(mockSubjectRepository.getTheLastSevenSubject()).thenReturn(subjects);

        when(mockSubjectRepository.getReadCountSubject("uuid")).thenReturn(0);

        // Run the test
        final Map<Object, Object> result = analyticsControllerUnderTest.getCountOfImportantMessageRead();

        // Verify the results
    }

    @Test
    void testGetLikedMessages() {
        // Setup

        // Configure SubjectNameRepository.findAll(...).
        final SubjectName subjectName = new SubjectName();
        final Iterable<SubjectName> subjectNames = Arrays.asList(subjectName);
        when(mockSubjectNameRepository.findAll()).thenReturn(subjectNames);

        when(mockSubjectRepository.getLikedMessages("subjectName")).thenReturn(0);

        // Run the test
        final RadarChartData result = analyticsControllerUnderTest.getLikedMessages();

        // Verify the results
    }
}
