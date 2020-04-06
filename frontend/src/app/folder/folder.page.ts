import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpclientService} from '../service/httpclient.service';
import {Person} from '../models/person';
import {Message} from '../models/message';
import {PopoverController} from '@ionic/angular';
import {PopoverComponent} from '../popover/popover.component';
import {Relationship} from '../models/relationship';


@Component({
    selector: 'app-folder',
    templateUrl: './folder.page.html',
    styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
    public folder: string;
    messageRead: { [key: number]: boolean } = {};
    private messageList;
    private allReadMessagesList;
    private allUnreadMessagesList;

    messageShown = true;
    private newCreatedList = [];
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
        level: '',
        uuid: '',
        opened: false
    };

    private relationship: Relationship = {
        username : '',
        uuid : ''
    };

    constructor(private activatedRoute: ActivatedRoute,
                private httpclient: HttpclientService,
                private popoverController: PopoverController) {
    }

    ngOnInit() {
        this.httpclient.getUserFromNeo4J().subscribe(res => {
            this.user = res;
            this.httpclient.getAllMessagesFromNeo4j(this.user.username).subscribe(messages => {
                this.messageList = messages;
                this.allReadMessagesList = this.messageList.readMassages;
                this.allUnreadMessagesList = this.messageList.unreadMassages;
                console.log(this.allReadMessagesList);
                console.log(this.allUnreadMessagesList);
            });
        });
        this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    }

    saveNewUser() {
        this.httpclient.createUserInNeo4j(this.user).subscribe();
    }

    openMessage(index,message) {
        message.opened = true;
        this.readMessage(index,message);

    }
    closeMessage(message) {
        message.opened = false;

    }


    async presentPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: PopoverComponent,
            event: ev,
            translucent: true
        });
        popover.onDidDismiss().then(level => {
            if (level.data) {
                this.message.subjectName = level.data.subject;
                this.message.level = level.data.level;
                console.log(level.data);
            }
        });
        return await popover.present();
    }

    restartInput() {
        this.message.message = '';
        this.message.level = '';
    }

    readMessage(index, message) {
        this.messageRead[index] = true;
        this.relationship.username = this.user.username;
        this.relationship.uuid = message.uuid;
        console.log(message)
        this.httpclient.createRelationshipBetweenExistingNodes(this.relationship).subscribe();
    }

    sendMessage() {
        const staticMessage = {
            subjectName: this.message.subjectName,
            message: this.message.message,
            level: this.message.level
        };
        this.newCreatedList.push(staticMessage);
        this.user.subjectList.push(this.message);
        this.httpclient.createLinkUserAndMessage(this.user).subscribe();
        this.message.message = '';
        this.message.level = '';
    }

}
