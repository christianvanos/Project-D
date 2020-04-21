import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})
export class UserPopoverComponent implements OnInit {

  constructor(private popoverController: PopoverController) { }
  ngOnInit() {}

  dismissPopover() {
    this.popoverController.dismiss();
  }


  onClick(type){
    if(type == "Logout"){
      console.log("logout pressed")
      this.dismissPopover();
    }
  }
}
