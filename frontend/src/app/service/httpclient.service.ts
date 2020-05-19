import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpclientService {
  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getUserFromNeo4J() {
    const url = `${this.url}/find`;
    return this.http.get(url);
  }

  getSubjectNames() {
    const url = `${this.url}/findSubjectName`;
    return this.http.get(url);
  }

  addSubject(subject) {
    const url = `${this.url}/addSubjectName`;
    return this.http.put(url, subject, httpOptions);
  }

  createUserInNeo4j(person) {
    const url = `${this.url}/create`;
    return this.http.put(url, person, httpOptions);
  }

  changePasswordOfuserInNeo4j(person) {
    const url = `${this.url}/changePassword`;
    return this.http.put(url, person, httpOptions);
  }

  getAllMessagesFromNeo4jFilter(username, type) {
    const url = `${this.url}/findSubject/${username}/${type}`;
    return this.http.get(url);
  }

  createMessageInNeo4j(message) {
    const url = `${this.url}/createSubject`;
    return this.http.put(url, message, httpOptions);
  }

  createLinkUserAndMessage(user) {
    const url = `${this.url}/linkedMessage`;
    return this.http.put(url, user, httpOptions);
  }

  createRelationshipBetweenExistingNodes(relationship) {
    const url = `${this.url}/createRelationship`;
    return this.http.put(url, relationship, httpOptions);
  }

  getAllMessagesFromNeo4j(username) {
    const url = `${this.url}/findSubject/${username}`;
    return this.http.get(url);
  }
  getAllUnreadHighLevelMessages(username) {
    const url = `${this.url}/getUnreadHighLevel/${username}`;
    return this.http.get(url);
  }

  getBarChartData() {
    const url = `${this.url}/eachReadSubject`;
    return this.http.get(url);
  }

  getPieData() {
    const url = `${this.url}/getCountOfImportantMessageRead`;
    return this.http.get(url);
  }
}
