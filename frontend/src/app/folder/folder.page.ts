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
  private messageList: Array<any> = [];
  private user: Person = {
    id: null,
    name: '',
    username: ''
  };
  private message: Message = {
    id: null,
    message: '',
  };

  constructor(private activatedRoute: ActivatedRoute,
              private httpclient: HttpclientService) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  saveNewUser() {
    this.httpclient.createUserInNeo4j(this.user).subscribe();
  }

  sendMessage() {
  // this.httpclient.createMessageInNeo4j(this.message).subscribe();
    const staticMessage = this.message.message;
    this.messageList.push(staticMessage);
    this.message.message = '';
  }

}
