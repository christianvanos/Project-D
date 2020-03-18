package com.project78.graph.controller;

import com.project78.graph.entity.MessageRead;
import com.project78.graph.entity.Person;
import com.project78.graph.entity.Subject;
import com.project78.graph.repository.LinkedRelationshipRepository;
import com.project78.graph.repository.PersonRepository;
import com.project78.graph.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/")
public class PersonController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PersonController.class);

    @Autowired
    PersonRepository personRepository;

    @Autowired
    LinkedRelationshipRepository linkedRelationshipRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @RequestMapping(value = "find", method = RequestMethod.GET)
    public Person get() {
        Person person = personRepository.findByName("test");
        System.out.println(person);
        return person;
    }

    @RequestMapping(value = "create", method = RequestMethod.PUT)
    public ResponseEntity createPerson(@RequestBody Person person) {
        Person newlyAddedPerson = new Person();
        newlyAddedPerson.setName(person.getName());
        newlyAddedPerson.setUsername(person.getUsername());
        personRepository.save(person);
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "linkedMessage", method = RequestMethod.PUT)
    public ResponseEntity linkMessageToPerson(@RequestBody Person person) {
        if (personRepository.findById(person.getId()).isPresent()) {
            Person personFromDB = personRepository.findById(person.getId()).get();
            person.getSubjectList().forEach(personFromDB::readMessage);
            personRepository.save(personFromDB);
        }
        return ResponseEntity.ok().build();
    }

    @Transactional
    @RequestMapping(value = "deletelinkedMessage", method = RequestMethod.PUT)
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
