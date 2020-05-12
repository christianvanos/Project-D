import { Component, OnInit } from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {AuthenticationService} from "../service/authentication.service";

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  subjectPopover = false;
  levelPopover = false;
  userOptionsPopover = false;
  constructor(private popoverController: PopoverController, public navParams: NavParams,
              private loginService: AuthenticationService) { }

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

  getName(){
    return sessionStorage.getItem('name');
  }

  userOptionClicked(type){
    switch(type.toUpperCase()){
      case "LOGOUT":
        this.loginService.logOut();
        break;
      default:
        break;
    }
    this.userOptionsPopover = false;
    this.dismissPopover();
  }



}
