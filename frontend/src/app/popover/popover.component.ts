import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  dismissPopover() {
   this.popoverController.dismiss();
  }

  levelChoosed(messageLevel) {
    this.popoverController.dismiss(messageLevel);
  }

}
