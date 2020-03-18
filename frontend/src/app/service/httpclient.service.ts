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

  createUserInNeo4j(person) {
    const url = `${this.url}/create`;
    return this.http.put(url, person, httpOptions);
  }

  createMessageInNeo4j(message) {
    const url = `${this.url}/createSubject`;
    return this.http.put(url, message, httpOptions);
  }
}
