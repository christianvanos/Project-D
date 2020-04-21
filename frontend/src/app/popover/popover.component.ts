import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  levelSelected = false;
  userPopover = false;
  levelValue;
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  dismissPopover() {
   this.popoverController.dismiss();
  }

  levelChoosed(messageLevel) {
    this.levelValue = messageLevel;
    this.levelSelected = true;
  }

  subjectChoosed(subject) {
    const message = {subject, level : this.levelValue};
    this.popoverController.dismiss(message);
  }

  userPopoverButton(type){
    this.userPopover = true;
    if(type == "Logout"){

    }
  }


}
