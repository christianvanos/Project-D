import {Component, Input, OnInit} from '@angular/core';
import {Relationship} from "../models/relationship";
import {HttpclientService} from "../service/httpclient.service";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
  messageRead: { [key: number]: boolean } = {};
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
  // Data passed in by componentProps
  @Input() list: any;
  constructor(
      private httpclient: HttpclientService,
      private modalController: ModalController
  ) { }

  ngOnInit() {
    this.httpclient.getUserFromNeo4J().subscribe(res => {
      this.user = res;
    });
  }

  readMessage(index, message) {
    this.messageRead[index] = true;
    this.relationship.username = this.user.username;
    this.relationship.uuid = message.uuid;
    this.httpclient
        .createRelationshipBetweenExistingNodes(this.relationship)
        .subscribe();
  }
  closeModal() {
    this.modalController.dismiss();
  }
}
