import {Component, OnInit} from '@angular/core';

import {ModalController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {HttpclientService} from './service/httpclient.service';
import {UserModalComponent} from './user-modal/user-modal.component';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public selectedIndex = 1;
    public appPages = [
        {
            title: 'Maak nieuw account',
            url: '/folder/Account',
            icon: 'mail'
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
        private modalController: ModalController
    ) {
        console.log('test');
        this.httpclient.getUserFromNeo4J().subscribe(res => console.log(res));
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

    ngOnInit() {
        const path = window.location.pathname.split('folder/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        }
    }

}

