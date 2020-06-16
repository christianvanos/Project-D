import { Component, OnInit } from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {AuthenticationService} from "../service/authentication.service";
import { HttpclientService } from "../service/httpclient.service";
import {Relationship} from "../models/relationship";

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
   user: any = {
    id: null,
    name: '',
    username: '',
    password: '',
    role: '',
    subjectList: []
  };
  subjectPopover = false;
  levelPopover = false;
  userOptionsPopover = false;
   newCreatedList = [];
   subject: string;
  constructor(private popoverController: PopoverController, public navParams: NavParams,
              private loginService: AuthenticationService,
              private httpclient: HttpclientService) { }

  ngOnInit() {
    switch (this.navParams.get('type').toUpperCase()) {
      case "LEVEL":
        this.levelPopover = true;
        break;
      case "SUBJECT":
        this.loadUserData();
        this.loadSubjects();
        this.subjectPopover = true;
        break;
      case "USER":
        this.loadUserData();
        this.userOptionsPopover = true;
        break;
      default:
        break;
    }
  }

  // Further improvements: Server sided caching.
  loadSubjects() {
    this.httpclient.getSubjectNames().subscribe((res => this.newCreatedList.push(res)));
  }

  loadUserData() {
    this.httpclient.getUserFromNeo4J().subscribe(res => {this.user = res;});
  }

  dismissPopover() {
   this.popoverController.dismiss();
  }

  chooseLevel(messageLevel) {
    this.levelPopover = false;
    this.popoverController.dismiss(messageLevel);
  }

  chooseSubject(subject) {
    this.subjectPopover = false;
    this.popoverController.dismiss(subject);
  }

  getName() {
    return sessionStorage.getItem('username');
  }

  userOptionClicked(type) {
    switch (type.toUpperCase()) {
      case "LOGOUT":
        this.loginService.logOut();
        break;
      default:
        break;
    }
    this.userOptionsPopover = false;
    this.dismissPopover();
  }

  createSubject() {
    this.newCreatedList[0].push(this.subject);
    this.httpclient.addSubject(this.subject).subscribe();
    this.subject = '';
    // this.chooseSubject(this.subject);
  }

}
