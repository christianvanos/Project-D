import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {AppComponent} from "../app.component";
import {AuthenticationService} from "../service/authentication.service";



@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})
export class UserPopoverComponent implements OnInit {

  constructor(private popoverController: PopoverController,
              private loginService: AuthenticationService,
  ) { }
  ngOnInit() {}

  dismissPopover() {
    this.popoverController.dismiss();
  }

  getName(){
    return sessionStorage.getItem('name');
  }

  onClick(type){
    if(type == "Logout"){
      this.loginService.logOut();
      this.dismissPopover();
    }
  }
}
