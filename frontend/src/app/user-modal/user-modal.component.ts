import {Component, Input, OnInit} from '@angular/core';
import {Relationship} from "../models/relationship";
import {HttpclientService} from "../service/httpclient.service";
import {ModalController} from "@ionic/angular";
import * as moment from 'moment';
import 'moment/locale/nl';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
  messageRead: { [key: number]: boolean } = {};
  Gelezen = [];
  private relationship: Relationship = {
    username: '',
    uuid: '',
    relation: ''
  };
  private user: any = {
    id: null,
    name: '',
    username: '',
    password: '',
    role: '',
    subjectList: []
  };
  public devWidth = this.platform.width();
  // Data passed in by componentProps
  @Input() list: any;
  constructor(
      private httpclient: HttpclientService,
      private modalController: ModalController,
      public platform: Platform
  ) { }

  ngOnInit() {

    this.httpclient.getUserFromNeo4J().subscribe(res => {
      this.user = res;
    });
  }

  CheckedMessage(index) {
    this.Gelezen[index] = true;
  }

  openMessage(index, message) {
    message.opened = true;
    if (!message.read) {
      this.readMessage(index, message);
    }
  }

  closeMessage(message) {
    message.opened = false;
  }

  likeMessage(message) {
    this.relationship.username = this.user.username;
    this.relationship.uuid = message.uuid;
    this.relationship.relation = "LIKED_MESSAGE";
    this.httpclient
        .createRelationshipBetweenExistingNodes(this.relationship)
        .subscribe();
  }


  getFormattedDatetime(datetime) {
    return moment(datetime).calendar();
  }

  readMessage(index, message) {
    this.messageRead[index] = true;
    this.relationship.username = this.user.username;
    this.relationship.uuid = message.uuid;
    this.relationship.relation = "READ_MESSAGE";
    this.httpclient
        .createRelationshipBetweenExistingNodes(this.relationship)
        .subscribe();
  }
  async close() {
    await this.modalController.dismiss();
  }
}
