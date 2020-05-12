package com.project78.graph.controller;

import com.project78.graph.entity.Subject;
import com.project78.graph.entity.Person;
import com.project78.graph.model.Messages;
import com.project78.graph.model.Relationship;
import com.project78.graph.model.SubjectPerson;
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
        List<Subject> notReadmessages = (List<Subject>) subjectRepository.findAll();
        List<Subject> readMessages = subjectRepository.allReadMessages(username);
//        List<Subject> likedMessages = subjectRepository.allLikedMessages(username);
//        System.out.println(likedMessages);

//        notReadmessages.forEach((message) -> {
//            readMessages.forEach((val) -> {
//                if(message.getUUID() == val.getUUID()){
//                    message.setRead(true);
//                    return;
//                }
//
//            });
//            likedMessages.forEach((likedMessage) -> {
//                        if (message.getUUID() == likedMessage.getUUID()) {
//                            message.setLiked(true);
//                            return;
//                        }
//                    });
//            System.out.println(message);
//        });
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
    public ResponseEntity createPerson(@RequestBody SubjectPerson subjectPerson) {
        Subject newSubject = new Subject();
        newSubject.setSubjectName(subjectPerson.getSubject().getSubjectName());
        newSubject.setLevel(subjectPerson.getSubject().getLevel());
        newSubject.setMessage(subjectPerson.getSubject().getMessage());
        newSubject.setTitle(subjectPerson.getSubject().getTitle());
        newSubject.setPostedBy(subjectPerson.getPerson().getName());
        newSubject.setDatetimePosted(subjectPerson.getSubject().getDatetimePosted());
        UUID uuid = UUID.randomUUID();
        newSubject.setUUID(uuid.toString());
        System.out.println(newSubject.toString());
        subjectRepository.save(newSubject);

        Relationship relationship = new Relationship();
        relationship.setUUID(uuid.toString());
        relationship.setUsername(subjectPerson.getPerson().getUsername());
        relationship.setRelation("MESSAGE_POSTED_BY");
        createRelationshipBetweenExistingNodes(relationship);
        return ResponseEntity.ok().build();
    }

    @PutMapping("createRelationship")
    public ResponseEntity createRelationshipBetweenExistingNodes(@RequestBody Relationship relationship) {
        System.out.println(relationship.getUsername() + "  " + relationship.getUUID() + "  " + relationship.getRelation() );

        switch (relationship.getRelation().toUpperCase()){
            case "READ_MESSAGE":
                subjectRepository.createRelationship(relationship.getUsername(), relationship.getUUID());
                break;
            case "MESSAGE_POSTED_BY":
                subjectRepository.createPostedByRelation(relationship.getUsername(), relationship.getUUID());
                subjectRepository.createRelationship(relationship.getUsername(), relationship.getUUID());
                break;
            case "LIKED_MESSAGE":
                subjectRepository.createLikedRelation(relationship.getUsername(), relationship.getUUID());
                break;
            default:
                break;
        }
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
