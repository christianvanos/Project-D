import { Component, OnInit } from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
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
              private router: Router) {router.events
      .subscribe((event: NavigationStart) => {
          if (event.navigationTrigger === 'popstate') {
              this.redirectIfLoggedIn();
          }
      }); }


  ngOnInit() {
      this.redirectIfLoggedIn();
  }

  redirectIfLoggedIn(){
      if (sessionStorage.getItem('username') !== null ||
          sessionStorage.getItem('username') !== undefined ||
          sessionStorage.getItem('username') !== '' ){
          this.router.navigate(['/folder/Feed']);
      }
  }

  onLogin() {
    (this.loginService.authenticate(this.username, this.password).subscribe(
            data => {
              // if ( data === 'NOPERMISSIONS') {
              //   this.error = 'No permissions to access this platform.';
              // } else {
                // this.alertService.presentToast('Logged In');
                this.router.navigate(['/folder/Feed']);
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
