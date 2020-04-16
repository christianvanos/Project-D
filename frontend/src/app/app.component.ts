import {Component, OnInit} from '@angular/core';

import {ModalController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {HttpclientService} from './service/httpclient.service';
import {UserModalComponent} from './user-modal/user-modal.component';
import {AuthenticationService} from './service/authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public selectedIndex = 1;
    private user;
    private login;
    username: string;
    password: string;
    error = '';
    private location;
    public appPages = [
        {
            title: 'Account',
            url: '/folder/Account',
            icon: 'person'
        },
        {
            title: 'Feed',
            url: '/folder/Feed',
            icon: 'paper-plane'
        }
    ];
    public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private httpclient: HttpclientService,
        private loginService: AuthenticationService,
        private router: Router,
        private modalController: ModalController
    ) {
        console.log(window.location);
        // this.httpclient.getUserFromNeo4J().subscribe(res => this.user = res);
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    clickedMenuButton(index) {
        if (index === 0) {
            console.log('nieuw account aanmaken');
        } else {
            console.log('berichtenfeed zien');
        }
    }

    onLogout() {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('jwtToken');
        const index = this.appPages.findIndex(x => x.title === 'Maak account');
        this.appPages.splice(index, 1);
        this.login = null;
        this.router.navigate(['']);
    }

    onLogin() {
        (this.loginService.authenticate(this.username, this.password).subscribe(
                data => {
                    // if ( data === 'NOPERMISSIONS') {
                    //   this.error = 'No permissions to access this platform.';
                    // } else {
                    // this.alertService.presentToast('Logged In');
                    this.login = true;
                    this.router.navigate(['/main-menu']);
                    this.error = '';
                    this.httpclient.getUserFromNeo4J().subscribe(
                        user => {
                            this.user = user;
                            sessionStorage.setItem('name', this.user.name);
                            if (this.user.role === 'ADMIN') {
                                this.appPages.push({title: 'Maak account', url: '/folder/Create', icon: 'mail'});
                            }
                        }
                    );
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

    ngOnInit() {
        if (sessionStorage.getItem('username') != null) {
            this.login = true;
            this.httpclient.getUserFromNeo4J().subscribe(
                user => {
                    this.user = user;
                    sessionStorage.setItem('name', this.user.name);
                    if (this.user.role === 'ADMIN') {
                        this.appPages.push({title: 'Maak account', url: '/folder/Create', icon: 'mail'});
                    }
                }
            );
        } else  {
            this.login = false;
        }
        console.log(this.login);
        this.location = window.location.pathname;
        const path = window.location.pathname.split('folder/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        }
    }

}

