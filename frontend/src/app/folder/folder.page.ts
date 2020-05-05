import { Component, OnInit, Renderer2 } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpclientService } from "../service/httpclient.service";
import { Person } from "../models/person";
import { Message } from "../models/message";
import { PopoverController } from "@ionic/angular";
import { PopoverComponent } from "../popover/popover.component";
import { Relationship } from "../models/relationship";
import { ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ToastController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";

import { DatePipe } from "@angular/common";

class CardsInterface {
  title: string;
  name: string;
  icon: string;
}

@Component({
  selector: "app-folder",
  templateUrl: "./folder.page.html",
  styleUrls: ["./folder.page.scss"],
  providers: [DatePipe]
})
export class FolderPage implements OnInit {
  public folder: string;
  messageRead: { [key: number]: boolean } = {};
  private messageList;
  private allReadMessagesList;
  private allUnreadMessagesList;
  messageShown = true;
  createMessageOpen = false;
  private newCreatedList = [];
  private user: any = {
    id: null,
    name: "",
    username: "",
    password: "",
    role: "",
    subjectList: []
  };
  private message: Message = {
    id: null,
    message: "",
    title: "",
    datetimePosted: null,
    subjectName: "",
    level: "",
    uuid: "",
    opened: false
  };

  private relationship: Relationship = {
    username: "",
    uuid: ""
  };
  cards: CardsInterface[] = [
    { title: 'Card Two', name: 'Card2', icon: 'star-outline' }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpclient: HttpclientService,
    private popoverController: PopoverController,
    private datePipe: DatePipe,
    private toastCtrl: ToastController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.httpclient.getUserFromNeo4J().subscribe(res => {
      this.user = res;
      this.httpclient
        .getAllMessagesFromNeo4j(this.user.username)
        .subscribe(messages => {
          this.messageList = messages;
          this.allReadMessagesList = this.messageList.readMassages;
          this.allUnreadMessagesList = this.messageList.unreadMassages;
          console.log(this.allReadMessagesList);
          console.log(this.allUnreadMessagesList);
          console.log(this.messageList.readMassages);
        });
    });
    this.folder = this.activatedRoute.snapshot.paramMap.get("id");
  }

  getCreateMessageSubjectName(){
    return this.message.subjectName != ""? this.message.subjectName: 'Type' ;
  }

  getCreateMessageLevel(){
    switch(this.message.level){
      case "":
        return "Prioriteit";
        break;
      case "High":
        return "Hoog";
        break;
      case "Medium":
        return "Neutraal";
        break;
      case "Low":
        return "Laag";
        break;
      default:
        return "Error: Wrong level variable";
        break;
    }
  }

  saveNewUser(data, form: NgForm) {
    if (
      data.role === "" ||
      data.name === "" ||
      data.username === "" ||
      data.password === "" ||
      data.confirmPassword === ""
    ) {
      this.empty();
    } else if (data.password === data.confirmPassword) {
      const newUser = {
        name: data.name,
        username: data.username,
        role: data.role,
        password: data.password
      };
      this.httpclient.createUserInNeo4j(newUser).subscribe();
      form.resetForm();
      this.saveCompleted();
    } else {
      this.presentAlert();
    }
  }

  async setCreateMessageLevel(event){
    if(this.message.level == ""){
      const popover = await this.popoverController.create({
        component: PopoverComponent,
        event: event,
        componentProps: {"type":"level"},
        translucent: true
      });
      popover.onDidDismiss().then(result => {
        if (result.data) {
          this.message.level = result.data;
        }
      });
      return await popover.present();
    } else {
      this.message.level = "";
    }
  }

  filter(data, form: NgForm) {
    console.log(data.type);
    this.httpclient.getUserFromNeo4J().subscribe(res => {
      this.user = res;
      this.httpclient
          .getAllMessagesFromNeo4jFilter(this.user.username, data.type)
          .subscribe(messages => {
            this.messageList = messages;
            this.allReadMessagesList = this.messageList.readMassages;
            this.allUnreadMessagesList = this.messageList.unreadMassages;
            console.log(this.allReadMessagesList);
            console.log(this.allUnreadMessagesList);
          });
    });
  }

  toggleLiked(card: any) {

    if (card.icon === 'star') {
      card.icon = 'star-outline';
    } else {
      card.icon = 'star';
    }
  }

  async setCreateMessageSubjectName(event){
    if(this.message.subjectName == ""){
      const popover = await this.popoverController.create({
        component: PopoverComponent,
        event: event,
        componentProps: {"type":"subject"},
        translucent: true
      });
      popover.onDidDismiss().then(result => {
        if (result.data) {
          this.message.subjectName = result.data;
        }
      });
      return await popover.present();
    } else {
      this.message.subjectName = "";
    }
  }

  async empty() {
    const empty = await this.alertController.create({
      message: "whoops, something is empty check again",
      buttons: ["ok"]
    });

    await empty.present();
    const result = await empty.onDidDismiss();
    console.log(result);
  }

  async saveCompleted() {
    const toast = await this.toastCtrl.create({
      message: "User is created!",
      position: "top",
      buttons: ["Dismiss"]
    });
    await toast.present();
  }

  async presentAlert() {
    const toast = await this.toastCtrl.create({
      message: "Passwords do not match, please try again",
      position: "top",
      buttons: ["Dismiss"]
    });
    await toast.present();
  }

  openMessage(index, message) {
    message.opened = true;
    this.readMessage(index, message);
  }

  closeMessage(message) {
    message.opened = false;
  }

  openMessageCreation() {
    this.createMessageOpen = true;
  }


  getName(){
    return sessionStorage.getItem('name');
  }

  async showUserOptionsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {"type":"user"}
    });
    return await popover.present();
  }

  restartInput() {
    this.message.message = "";
    this.message.level = "";
    this.message.subjectName = "";
    this.message.title = "";
  }
  closeInput() {
    this.createMessageOpen = false;
    this.restartInput();
  }

  readMessage(index, message) {
    this.messageRead[index] = true;
    this.relationship.username = this.user.username;
    this.relationship.uuid = message.uuid;
    console.log(message);
    this.httpclient
      .createRelationshipBetweenExistingNodes(this.relationship)
      .subscribe();
  }

  sendMessage() {
    const staticMessage = {
      title: this.message.title,
      datetimePosted: this.datePipe
        .transform(new Date(), "dd-MM-yyy hh:mm:ss")
        .toString(),
      subjectName: this.message.subjectName,
      message: this.message.message,
      level: this.message.level
    };
    this.newCreatedList.push(staticMessage);
    this.user.subjectList.push(this.message);
    this.httpclient.createLinkUserAndMessage(this.user).subscribe();
    this.closeInput();
  }
}
