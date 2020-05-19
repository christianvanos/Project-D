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
  private user: any = {
    id: null,
    name: "",
    username: "",
    password: "",
    role: "",
    subjectList: []
  };
  subjectPopover = false;
  levelPopover = false;
  userOptionsPopover = false;
  private newCreatedList = [];
  private subject: string;
  constructor(private popoverController: PopoverController, public navParams: NavParams,
              private loginService: AuthenticationService,
              private httpclient: HttpclientService) { }

  ngOnInit() {
    switch (this.navParams.get('type').toUpperCase()) {
      case "LEVEL":
        this.levelPopover = true;
        break;
      case "SUBJECT":
        this.subjectPopover = true;
        break;
      case "USER":
        this.userOptionsPopover = true;
        break;
      default:
        break;
    }
    this.httpclient.getUserFromNeo4J().subscribe(res => {
      this.user = res;
    });
    this.httpclient.getSubjectNames().subscribe((test => this.newCreatedList.push(test)));
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
    this.subject = '';
    this.httpclient.addSubject(this.subject).subscribe();
  }

}
