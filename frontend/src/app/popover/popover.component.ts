import { Component, OnInit } from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {AuthenticationService} from "../service/authentication.service";
import { HttpclientService } from "../service/httpclient.service";

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

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
    return sessionStorage.getItem('name');
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
    // const test = Object.keys(this.subject).map(key => ({type: key, value: this.subject[key]}));
    // console.log(this.subject);
    this.httpclient.addSubject(this.subject).subscribe();
    this.subjectPopover = false;
    this.popoverController.dismiss();
  }

}
