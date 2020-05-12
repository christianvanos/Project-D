package com.project78.graph.controller;


import com.project78.graph.config.JwtTokenUtil;
import com.project78.graph.entity.Person;
import com.project78.graph.entity.SubjectName;
import com.project78.graph.model.JwtRequest;
import com.project78.graph.model.JwtResponse;
import com.project78.graph.repository.PersonRepository;
import com.project78.graph.repository.SubjectNameRepository;
import com.project78.graph.service.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin
public class JwtAuthenticationController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private JwtUserDetailsService jwtUserDetailsService;

	@Autowired
	private PersonRepository personRepository;

	@Autowired
	private SubjectNameRepository subjectNameRepository;

	@Autowired
	PasswordEncoder passwordEncoder;

	@RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {

		List<Person> accounts = (List<Person>) personRepository.findAll();
		if (Objects.isNull(accounts) || accounts.isEmpty()) {
			Person root = new Person();
			root.setName("root");
			root.setUsername("root");
			root.setRole("ADMIN");
			root.setPassword(passwordEncoder.encode("root"));
			personRepository.save(root);
		}
//		SubjectName defaultvalues = new SubjectName();
//		subjectNameRepository.save(defaultvalues);
		authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());

		final UserDetails userDetails = jwtUserDetailsService
				.loadUserByUsername(authenticationRequest.getUsername());

		final String token = jwtTokenUtil.generateToken(userDetails);

		return ResponseEntity.ok(new JwtResponse(token));
	}

	private void authenticate(String username, String password) throws Exception {
		Objects.requireNonNull(username);
		Objects.requireNonNull(password);

		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
		} catch (DisabledException e) {
			throw new Exception("USER_DISABLED", e);
		} catch (BadCredentialsException e) {
			throw new Exception("INVALID_CREDENTIALS", e);
		}
	}
}
