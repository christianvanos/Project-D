package com.project78.graph.controller;

import com.project78.graph.entity.Person;
import com.project78.graph.repository.LinkedRelationshipRepository;
import com.project78.graph.repository.PersonRepository;
import com.project78.graph.repository.SubjectRepository;
import com.project78.graph.utils.Utils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PersonControllerTest {

    private PersonController personControllerUnderTest;

    @BeforeEach
    void setUp() {
        personControllerUnderTest = new PersonController();
        personControllerUnderTest.utils = mock(Utils.class);
        personControllerUnderTest.passwordEncoder = mock(PasswordEncoder.class);
        personControllerUnderTest.personRepository = mock(PersonRepository.class);
        personControllerUnderTest.linkedRelationshipRepository = mock(LinkedRelationshipRepository.class);
        personControllerUnderTest.subjectRepository = mock(SubjectRepository.class);
    }

    @Test
    void testGet() {
        // Setup

        // Configure PersonRepository.findByUsername(...).
        final Person person = new Person();
        person.setName("name");
        person.setUsername("username");
        person.setPassword("password");
        person.setRole("role");
        when(personControllerUnderTest.personRepository.findByUsername("username")).thenReturn(person);

        when(personControllerUnderTest.utils.getUsernameFromPrincipal()).thenReturn("result");

        // Run the test
        final Person result = personControllerUnderTest.get();

        // Verify the results
    }

    @Test
    void testCreatePerson() {
        // Setup
        final Person person = new Person();
        person.setName("name");
        person.setUsername("username");
        person.setPassword("password");
        person.setRole("role");

        when(personControllerUnderTest.passwordEncoder.encode("charSequence")).thenReturn("result");

        // Configure PersonRepository.save(...).
        final Person person1 = new Person();
        person1.setName("name");
        person1.setUsername("username");
        person1.setPassword("password");
        person1.setRole("role");
        when(personControllerUnderTest.personRepository.save(any(Person.class))).thenReturn(person1);

        // Run the test
        final ResponseEntity result = personControllerUnderTest.createPerson(person);

        // Verify the results
    }

    @Test
    void testAlterPassword() {
        // Setup
        final Person person = new Person();
        person.setName("name");
        person.setUsername("username");
        person.setPassword("password");
        person.setRole("role");

        // Configure PersonRepository.findByUsername(...).
        final Person person1 = new Person();
        person1.setName("name");
        person1.setUsername("username");
        person1.setPassword("password");
        person1.setRole("role");
        when(personControllerUnderTest.personRepository.findByUsername("username")).thenReturn(person1);

        when(personControllerUnderTest.passwordEncoder.encode("charSequence")).thenReturn("result");

        // Configure PersonRepository.save(...).
        final Person person2 = new Person();
        person2.setName("name");
        person2.setUsername("username");
        person2.setPassword("password");
        person2.setRole("role");
        when(personControllerUnderTest.personRepository.save(any(Person.class))).thenReturn(person2);

        // Run the test
        final ResponseEntity result = personControllerUnderTest.alterPassword(person);

        // Verify the results
    }

    @Test
    void testLinkMessageToPerson() {
        // Setup
        final Person person = new Person();
        person.setName("name");
        person.setUsername("username");
        person.setPassword("password");
        person.setRole("role");

        // Configure PersonRepository.findById(...).
        final Person person2 = new Person();
        person2.setName("name");
        person2.setUsername("username");
        person2.setPassword("password");
        person2.setRole("role");
        when(personControllerUnderTest.personRepository.findByUsername("usenername")).thenReturn(person2);

        // Configure PersonRepository.save(...).
        final Person person3 = new Person();
        person3.setName("name");
        person3.setUsername("username");
        person3.setPassword("password");
        person3.setRole("role");
        when(personControllerUnderTest.personRepository.save(any(Person.class))).thenReturn(person3);

        // Run the test
        final ResponseEntity result = personControllerUnderTest.linkMessageToPerson(person);

        // Verify the results
    }

    @Test
    void testDeletelinkMessageToPerson() {
        // Setup
        final Person person = new Person();
        person.setName("name");
        person.setUsername("username");
        person.setPassword("password");
        person.setRole("role");

        // Configure PersonRepository.findById(...).
        final Person person2 = new Person();
        person2.setName("name");
        person2.setUsername("username");
        person2.setPassword("password");
        person2.setRole("role");
        when(personControllerUnderTest.personRepository.findByUsername("username")).thenReturn(person2);

        // Configure PersonRepository.save(...).
        final Person person3 = new Person();
        person3.setName("name");
        person3.setUsername("username");
        person3.setPassword("password");
        person3.setRole("role");
        when(personControllerUnderTest.personRepository.save(any(Person.class))).thenReturn(person3);

        // Run the test
        final ResponseEntity result = personControllerUnderTest.deletelinkMessageToPerson(person);

        // Verify the results
    }
}
