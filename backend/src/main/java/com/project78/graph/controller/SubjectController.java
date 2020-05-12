package com.project78.graph.controller;

import com.project78.graph.entity.Subject;
import com.project78.graph.model.Messages;
import com.project78.graph.model.Relationship;
import com.project78.graph.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/")
public class SubjectController {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonController.class);

    @Autowired
    SubjectRepository subjectRepository;

    @GetMapping("findSubject/{username}")
    public Messages get(@PathVariable String username) {
        List <Subject> notReadmessages = (List<Subject>) subjectRepository.findAll();
        List<Subject> readMessages = subjectRepository.allReadMessages(username);
        notReadmessages.removeAll(readMessages);
        Messages messages = new Messages(readMessages, notReadmessages);
        return messages;
//        ArrayList<Subject> subjects = (ArrayList<Subject>) subjectRepository.findAll();
//        return subjects;
    }

    @GetMapping("findSubject/{username}/{type}")
    public Messages get(@PathVariable String username, @PathVariable String type) {
        System.out.println(username + type);
        Messages messages = this.get(username);
        List<Subject> readMessages = messages.getReadMassages();
        List <Subject> notReadmessages = messages.getUnreadMassages();

        for (int i=0; i < readMessages.size(); i++) {
            Subject curr_subject = readMessages.get(i);
            if (curr_subject.getSubjectName().toString().compareTo(type) != 0) {
                readMessages.remove(curr_subject);
            }
        }

        for (int i=0; i < notReadmessages.size(); i++) {
            Subject curr_subject = notReadmessages.get(i);
            if (curr_subject.getSubjectName().toString().compareTo(type) != 0) {
                System.out.println(curr_subject.getSubjectName() + " " + type);
                notReadmessages.remove(curr_subject);
            }
        }

        messages = new Messages(readMessages, notReadmessages);
        System.out.println(messages);
        return messages;
    }

    @PutMapping("createSubject")
    public ResponseEntity createPerson(@RequestBody Subject subject) {
        Subject newSubject = new Subject();
        newSubject.setSubjectName(subject.getSubjectName());
        newSubject.setLevel(subject.getLevel());
        newSubject.setMessage(subject.getMessage());
        UUID uuid = UUID.randomUUID();
        newSubject.setUUID(uuid.toString());
        System.out.println(newSubject.toString());
        subjectRepository.save(newSubject);
        return ResponseEntity.ok().build();
    }

    @PutMapping("createRelationship")
    public ResponseEntity createRelationshipBetweenExistingNodes(@RequestBody Relationship relationship) {
        System.out.println(relationship.getUsername() + "  " + relationship.getUUID());
        subjectRepository.createRelationship(relationship.getUsername(), relationship.getUUID());
        return ResponseEntity.ok().build();
    }

}
