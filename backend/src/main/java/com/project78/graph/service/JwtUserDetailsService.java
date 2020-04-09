package com.project78.graph.service;

import com.project78.graph.entity.Person;
import com.project78.graph.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JwtUserDetailsService implements UserDetailsService {

	@Autowired
	PersonRepository personRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Person person = personRepository.findByUsername(username);
		if (Objects.nonNull(person)) {
			return new User(person.getUsername(), person.getPassword(),
					Arrays.stream(person.getRole().split(",")).map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
		} else {
			throw new UsernameNotFoundException("User not found with username: " + username);
		}
	}

}