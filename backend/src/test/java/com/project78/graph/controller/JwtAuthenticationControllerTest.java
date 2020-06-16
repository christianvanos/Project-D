package com.project78.graph.controller;

import com.project78.graph.config.JwtTokenUtil;
import com.project78.graph.entity.Person;
import com.project78.graph.model.JwtRequest;
import com.project78.graph.repository.PersonRepository;
import com.project78.graph.repository.SubjectNameRepository;
import com.project78.graph.service.JwtUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.initMocks;

class JwtAuthenticationControllerTest {

    @Mock
    private AuthenticationManager mockAuthenticationManager;
    @Mock
    private JwtTokenUtil mockJwtTokenUtil;
    @Mock
    private JwtUserDetailsService mockJwtUserDetailsService;
    @Mock
    private PersonRepository mockPersonRepository;
    @Mock
    private SubjectNameRepository mockSubjectNameRepository;
    @Mock
    private PasswordEncoder mockPasswordEncoder;

    @InjectMocks
    private JwtAuthenticationController jwtAuthenticationControllerUnderTest;

    @BeforeEach
    void setUp() {
        initMocks(this);
    }

    @Test
    void testCreateAuthenticationToken() throws Exception {
        // Setup
        final JwtRequest authenticationRequest = new JwtRequest("username", "password");

        // Configure PersonRepository.findAll(...).
        final Person person = new Person();
        person.setName("name");
        person.setUsername("username");
        person.setPassword("password");
        person.setRole("role");
        final Iterable<Person> people = Arrays.asList(person);
        when(mockPersonRepository.findAll()).thenReturn(people);

        when(mockPasswordEncoder.encode("charSequence")).thenReturn("result");

        // Configure PersonRepository.save(...).
        final Person person1 = new Person();
        person1.setName("name");
        person1.setUsername("username");
        person1.setPassword("password");
        person1.setRole("role");
        when(mockPersonRepository.save(any(Person.class))).thenReturn(person1);

        when(mockAuthenticationManager.authenticate(null)).thenReturn(null);
        when(mockJwtUserDetailsService.loadUserByUsername("username")).thenReturn(null);
        when(mockJwtTokenUtil.generateToken(any(UserDetails.class))).thenReturn("result");

        // Run the test
        final ResponseEntity<?> result = jwtAuthenticationControllerUnderTest.createAuthenticationToken(authenticationRequest);

        // Verify the results
    }

    @Test
    void testCreateAuthenticationToken_AuthenticationManagerThrowsAuthenticationException() throws Exception {
        // Setup
        final JwtRequest authenticationRequest = new JwtRequest("username", "password");

        // Configure PersonRepository.findAll(...).
        final Person person = new Person();
        person.setName("name");
        person.setUsername("username");
        person.setPassword("password");
        person.setRole("role");
        final Iterable<Person> people = Arrays.asList(person);
        when(mockPersonRepository.findAll()).thenReturn(people);

        when(mockPasswordEncoder.encode("charSequence")).thenReturn("result");

        // Configure PersonRepository.save(...).
        final Person person1 = new Person();
        person1.setName("name");
        person1.setUsername("username");
        person1.setPassword("password");
        person1.setRole("role");
        when(mockPersonRepository.save(any(Person.class))).thenReturn(person1);

        when(mockAuthenticationManager.authenticate(null)).thenThrow(BadCredentialsException.class);
        when(mockJwtTokenUtil.generateToken(any(UserDetails.class))).thenReturn("result");

        // Run the test
        final ResponseEntity<?> result = jwtAuthenticationControllerUnderTest.createAuthenticationToken(authenticationRequest);

        // Verify the results
    }

    @Test
    void testCreateAuthenticationToken_JwtUserDetailsServiceThrowsUsernameNotFoundException() throws Exception {
        // Setup
        final JwtRequest authenticationRequest = new JwtRequest("username", "password");

        // Configure PersonRepository.findAll(...).
        final Person person = new Person();
        person.setName("name");
        person.setUsername("username");
        person.setPassword("password");
        person.setRole("role");
        final Iterable<Person> people = Arrays.asList(person);
        when(mockPersonRepository.findAll()).thenReturn(people);

        when(mockPasswordEncoder.encode("charSequence")).thenReturn("result");

        // Configure PersonRepository.save(...).
        final Person person1 = new Person();
        person1.setName("name");
        person1.setUsername("username");
        person1.setPassword("password");
        person1.setRole("role");
        when(mockPersonRepository.save(any(Person.class))).thenReturn(person1);

        when(mockAuthenticationManager.authenticate(null)).thenReturn(null);
        when(mockJwtUserDetailsService.loadUserByUsername("nietBekend")).thenThrow(UsernameNotFoundException.class);
        when(mockJwtTokenUtil.generateToken(any(UserDetails.class))).thenReturn("result");

        // Run the test
        final ResponseEntity<?> result = jwtAuthenticationControllerUnderTest.createAuthenticationToken(authenticationRequest);

        // Verify the results
    }
}
