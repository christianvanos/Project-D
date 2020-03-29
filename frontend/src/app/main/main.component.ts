import { Component, OnInit } from '@angular/core';
import {HttpclientService} from '../service/httpclient.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  public selectedIndex = 1;
  private user;
  openFeed;
  openAccount;
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

  constructor(private http: HttpclientService,
              private router: Router) {
  }


  ngOnInit() {
    this.router.navigate(['/folder/Feed']);
  }
}
