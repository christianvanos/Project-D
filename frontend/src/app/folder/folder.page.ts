import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpclientService} from '../service/httpclient.service';
import {Person} from '../models/person';
import {Message} from '../models/message';
import {PopoverController} from '@ionic/angular';
import {PopoverComponent} from '../popover/popover.component';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  private messageList;
  private user: any = {
    id: null,
    name: '',
    username: '',
    password: '',
    subjectList: []
  };
  private message: Message = {
    id: null,
    message: '',
    subjectName: '',
    level: ''
  };

  constructor(private activatedRoute: ActivatedRoute,
              private httpclient: HttpclientService,
              private popoverController: PopoverController) { }

  ngOnInit() {
    this.httpclient.getUserFromNeo4J().subscribe(res => this.user = res);
    this.httpclient.getAllMessagesFromNeo4j().subscribe(messages => this.messageList = messages);
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  saveNewUser() {
    this.httpclient.createUserInNeo4j(this.user).subscribe();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    popover.onDidDismiss().then(level => {
      if (level.data) {
        this.message.level = level.data;
        console.log(this.message);
      }
    });
    return await popover.present();
  }

  restartInput() {
    this.message.message = '';
    this.message.level = '';
  }

  sendMessage() {
    const staticMessage = {
      subjectName : '',
      message : this.message.message,
      level: this.message.level
    };
    this.messageList.push(staticMessage);
    console.log(this.messageList);
    this.httpclient.createMessageInNeo4j(this.message).subscribe();
    this.user.subjectList.push(this.message);
    this.httpclient.createLinkUserAndMessage(this.user).subscribe();
    this.message.message = '';
  }

}
