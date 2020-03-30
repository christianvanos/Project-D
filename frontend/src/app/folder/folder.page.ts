import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpclientService} from '../service/httpclient.service';
import {Person} from '../models/person';
import {Message} from '../models/message';

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
    subjectList: []
  };
  private message: Message = {
    id: null,
    message: '',
  };

  constructor(private activatedRoute: ActivatedRoute,
              private httpclient: HttpclientService) { }

  ngOnInit() {
    this.httpclient.getUserFromNeo4J().subscribe(res => this.user = res);
    this.httpclient.getAllMessagesFromNeo4j().subscribe(messages => this.messageList = messages);
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  saveNewUser() {
    this.httpclient.createUserInNeo4j(this.user).subscribe();
  }

  sendMessage() {
    const staticMessage = {
      subjectName : '',
      message : this.message.message
    };
    this.messageList.push(staticMessage);
    console.log(this.messageList);
    this.httpclient.createMessageInNeo4j(this.message).subscribe();
    this.user.subjectList.push(this.message);
    this.httpclient.createLinkUserAndMessage(this.user).subscribe();
    this.message.message = '';
  }

}
