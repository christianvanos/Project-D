import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  error = '';
  constructor(private loginService: AuthenticationService,
              private router: Router) { }


  ngOnInit() {}
  onLogin() {
    (this.loginService.authenticate(this.username, this.password).subscribe(
            data => {
              // if ( data === 'NOPERMISSIONS') {
              //   this.error = 'No permissions to access this platform.';
              // } else {
                // this.alertService.presentToast('Logged In');
                this.router.navigate(['/main-menu']);
                this.error = '';
              // }
            },
            error => {
              if ( error.status === 0) {
                this.error = 'Service Temporarily Unavailable';
              } else {
                this.error = 'Incorrect Username or Password';
              }
            }
        )
    );
    this.username = this.password = '';
  }

}
