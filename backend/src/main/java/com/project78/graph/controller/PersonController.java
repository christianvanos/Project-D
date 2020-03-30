package com.project78.graph.controller;

import com.project78.graph.entity.MessageRead;
import com.project78.graph.entity.Person;
import com.project78.graph.entity.Subject;
import com.project78.graph.repository.LinkedRelationshipRepository;
import com.project78.graph.repository.PersonRepository;
import com.project78.graph.repository.SubjectRepository;
import com.project78.graph.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/")
public class PersonController {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonController.class);

    @Autowired
    Utils utils;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    PersonRepository personRepository;

    @Autowired
    LinkedRelationshipRepository linkedRelationshipRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @GetMapping("find")
    public Person get() {
        Person person = personRepository.findByUsername(utils.getUsernameFromPrincipal());
        System.out.println(person);
        return person;
    }

    @PutMapping("create")
    public ResponseEntity createPerson(@RequestBody Person person) {
        Person newlyAddedPerson = new Person();
        newlyAddedPerson.setName(person.getName());
        newlyAddedPerson.setUsername(person.getUsername());
        newlyAddedPerson.setPassword(passwordEncoder.encode(person.getPassword()));
        personRepository.save(person);
        return ResponseEntity.ok().build();
    }

    @PutMapping("linkedMessage")
    public ResponseEntity linkMessageToPerson(@RequestBody Person person) {
        if (personRepository.findById(person.getId()).isPresent()) {
            Person personFromDB = personRepository.findById(person.getId()).get();
            person.getSubjectList().forEach(personFromDB::readMessage);
            personRepository.save(personFromDB);
        }
        return ResponseEntity.ok().build();
    }

    @Transactional
    @PutMapping("deletelinkedMessage")
    public ResponseEntity deletelinkMessageToPerson(@RequestBody Person person) {
        Person personFromDB = null;
        Subject subjectFromDB;
        MessageRead messageFromDB;
        if (personRepository.findById(person.getId()).isPresent()) {
             personFromDB = personRepository.findById(person.getId()).get();
            person.getSubjectList().forEach(personFromDB::deleteLinkedMessage);
            personRepository.save(personFromDB);
        }
        return ResponseEntity.ok().build();
    }
}
