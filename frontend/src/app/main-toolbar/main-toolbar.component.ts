import { Component, OnInit } from '@angular/core';
import {UserPopoverComponent} from "../user-popover/user-popover.component";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
})
export class MainToolbarComponent implements OnInit {

  constructor(private popoverController: PopoverController){ }

  ngOnInit() {}


  async presentUserPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: UserPopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
}
