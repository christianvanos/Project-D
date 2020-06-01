package com.project78.graph.controller;

import com.project78.graph.entity.Person;
import com.project78.graph.entity.Subject;  
import com.project78.graph.model.SubjectPerson;
import com.project78.graph.entity.SubjectName;
import com.project78.graph.model.Messages;
import com.project78.graph.model.Relationship;
import com.project78.graph.repository.SubjectNameRepository;
import com.project78.graph.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import java.util.Date;

import java.text.SimpleDateFormat;
import java.text.DateFormat;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/")
public class SubjectController {
    Date lastUpdate = new Date();
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonController.class);

    @Autowired
    SubjectRepository subjectRepository;
    @Autowired
    SubjectNameRepository subjectNameRepository;

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


    @GetMapping("isfeedupdated/{datetime}")
    public boolean isFeedUpdated(@PathVariable String datetime) {
       boolean updated = false;

        try {
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyy hh:mm:ss");

            Date date = formatter.parse(datetime);
            System.out.println(datetime);
            System.out.println(date);
            System.out.println(lastUpdate);
            if (lastUpdate.compareTo(date) > 0){
                updated = true;
            }
        }
        catch(Exception error){
            System.out.println( error);

        }
        return updated;
    }


    @GetMapping("renew/{datetime}")
    public List<Subject> getFeedUpdate(@PathVariable String datetime) {
        List<Subject> updated = new ArrayList<Subject>();
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyy hh:mm:ss");
            Date date = formatter.parse(datetime);
//            System.out.println("date from client: " + date);
//            System.out.println("date from server: " + lastUpdate);
            if (lastUpdate.compareTo(date) > 0){

                updated = subjectRepository.getSubjectsSinceDatetime(date);
            }
        }
        catch(Exception error){
        System.out.println(error);
    }
        return updated;

    }

    @GetMapping("getUnreadHighLevel/{username}")
    public List<Subject> getUnreadHighLevelMessages(@PathVariable String username) {
        return subjectRepository.allUnreadHighLevelMessages(username);
    }

    @GetMapping("findSubject/{username}/{type}")
    public Messages get(@PathVariable String username, @PathVariable String type) {
        System.out.println(username + type);
        Messages messages = this.get(username);
        List<Subject> readMessages = messages.getReadMassages();
        List<Subject> notReadmessages = messages.getUnreadMassages();
        List<Subject> readMessagesIndexes = new ArrayList<Subject>();
        List<Subject> notReadMessagesIndexes = new ArrayList<Subject>();

        for (Integer i=0; i < readMessages.size(); i++) {
            Subject curr_subject = readMessages.get(i);
            String compareString = curr_subject.getSubjectName();
            if (compareString.compareTo(type) != 0) {
                readMessagesIndexes.add(curr_subject);
            }
        }

        for (int i=0; i < notReadmessages.size(); i++) {
            Subject curr_subject = notReadmessages.get(i);
            String compareString = curr_subject.getSubjectName();
            if (compareString.compareTo(type) != 0) {
                notReadMessagesIndexes.add(curr_subject);
            }
        }

        for (Subject subject : readMessagesIndexes) {
            readMessages.remove(subject);
        }

        for (Subject subject : notReadMessagesIndexes) {
            notReadmessages.remove(subject);
        }

        messages = new Messages(readMessages, notReadmessages);
        System.out.println(messages);
        return messages;
    }

    @PutMapping("createSubject")
    public ResponseEntity<String> createPerson(@RequestBody SubjectPerson subjectPerson) {
        Subject newSubject = new Subject();
        newSubject.setSubjectName(subjectPerson.getSubject().getSubjectName());
        newSubject.setLevel(subjectPerson.getSubject().getLevel());
        newSubject.setMessage(subjectPerson.getSubject().getMessage());
        newSubject.setTitle(subjectPerson.getSubject().getTitle());
        newSubject.setPostedBy(subjectPerson.getPerson().getName());
        newSubject.setDatetimePosted();
        UUID uuid = UUID.randomUUID();
        newSubject.setUUID(uuid.toString());
        System.out.println(newSubject.toString());
        subjectRepository.save(newSubject);

        Relationship relationship = new Relationship();
        relationship.setUUID(uuid.toString());
        relationship.setUsername(subjectPerson.getPerson().getUsername());
        relationship.setRelation("MESSAGE_POSTED_BY");
        createRelationshipBetweenExistingNodes(relationship);


        String response = String.format("{\"uuid\" : \"%s\"}", uuid.toString());

        return ResponseEntity.ok(response);
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

        lastUpdate = new Date();
        System.out.println(lastUpdate);

        return ResponseEntity.ok().build();
    }

    @GetMapping("findSubjectName")
    public List<String> get() {
        if (subjectNameRepository.count() == 0) {
            SubjectName newsubjectname = new SubjectName();
            newsubjectname.addSubject("Vergadering");
            newsubjectname.addSubject("Verjaardag");
            newsubjectname.addSubject("Management");
            subjectNameRepository.save(newsubjectname);
        }

        List<SubjectName> subjectNamesList = (List<SubjectName>) subjectNameRepository.findAll();
        List<String> subjectName = subjectNamesList.get(0).getSubjectNamesList();
        return subjectName;

    }

    @PutMapping("addSubjectName")
    public ResponseEntity addSubject(@RequestBody String subject) {
//        Check if geen subjectnames aanwezig...

        List<SubjectName> subjectNameList = (List<SubjectName>) subjectNameRepository.findAll();
        SubjectName newsubjectname = subjectNameList.get(0);
        newsubjectname.addSubject(subject);
        subjectNameRepository.save(newsubjectname);
        return ResponseEntity.ok().build();
    }

    // @PutMapping("createSubjectName")
    // public ResponseEntity createSubjectName(@RequestBody SubjectName subjectname) {
//
    // }

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
