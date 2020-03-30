package com.project78.graph.controller;

import com.project78.graph.entity.Person;
import com.project78.graph.entity.Subject;
import com.project78.graph.repository.PersonRepository;
import com.project78.graph.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/")
public class SubjectController {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonController.class);

    @Autowired
    SubjectRepository subjectRepository;

    @GetMapping("findSubject")
    public ArrayList<Subject> get() {
        ArrayList<Subject> subjects = (ArrayList<Subject>) subjectRepository.findAll();
        return subjects;
    }

    @PutMapping("createSubject")
    public ResponseEntity createPerson(@RequestBody Subject subject) {
        Subject newSubject = new Subject();
        newSubject.setSubjectName(subject.getSubjectName());
        newSubject.setMessage(subject.getMessage());
        subjectRepository.save(newSubject);
        return ResponseEntity.ok().build();
    }

//    @PutMapping("linkedMessage")
//    public ResponseEntity linkMessageToPerson(@RequestBody Person person) {
//        if (personRepository.findById(person.getId()).isPresent()) {
//            Person personFromDB = personRepository.findById(person.getId()).get();
//            person.getSubjectList().forEach(personFromDB::readMessage);
//            personRepository.save(personFromDB);
//        }
//        return ResponseEntity.ok().build();
//    }
}
