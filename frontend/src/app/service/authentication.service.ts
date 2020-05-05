import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from "@angular/router";
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    url = 'http://localhost:8080';

    constructor(private http: HttpClient,        private router: Router,
    ) { }
    authenticate(username: string, password: string) {
        const url = `${this.url}/authenticate`;
        return this.http.post<any>(url, {username, password}, httpOptions).pipe(
            map(
                userData => {
                    // console.log(userData.authorities);
                    // if (userData.authorities.find( role => role.authority === 'ADMIN' )) {
                        console.log(userData);
                        sessionStorage.setItem('username', username);
                        const jwtToken = 'Bearer ' + userData.token;
                        sessionStorage.setItem('jwtToken', jwtToken);
                        return userData;
                    // } else {
                    //     return 'NOPERMISSIONS';
                    // }
                }
            )
        );
    }
    isUserLoggedIn() {
        const user = sessionStorage.getItem('username');
        const jwt = sessionStorage.getItem('jwtToken');
        return !(user === null) && !(jwt === null) ;
    }
    logOut() {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('jwtToken');
        this.router.navigate(['../']);
    }

}
