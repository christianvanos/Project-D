import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpclientService} from '../service/httpclient.service';
import {Person} from '../models/person';
import {Message} from '../models/message';
import {PopoverController} from '@ionic/angular';
import {PopoverComponent} from '../popover/popover.component';
import {Relationship} from '../models/relationship';
import { ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import {AlertController} from '@ionic/angular';

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
    private newCreatedList = [];
    private user: any = {
        id: null,
        name: '',
        username: '',
        password: '',
        role: '',
        subjectList: []
    };
    private message: Message = {
        id: null,
        message: '',
        subjectName: '',
        level: '',
        uuid: ''
    };

    private relationship: Relationship = {
        username : '',
        uuid : ''
    };

    constructor(private activatedRoute: ActivatedRoute,
                private httpclient: HttpclientService,
                private popoverController: PopoverController,
                private toastCtrl: ToastController,
                public alertController: AlertController) {
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

    saveNewUser(data, form: NgForm) {
        if (data.role === '' || data.name === '' || data.username === '' || data.password === '' || data.confirmPassword === '') {
            this.empty();
        } else if (data.password === data.confirmPassword) {
            const newUser = {name: data.name, username: data.username, role: data.role, password: data.password};
            this.httpclient.createUserInNeo4j(newUser).subscribe();
            form.resetForm();
            this.saveCompleted();
        } else {
            this.presentAlert();
        }
    }

    async empty() {
        const empty = await this.alertController.create({
            message: 'whoops, something is empty check again',
            buttons: ['ok']
        });

        await empty.present();
        const result = await empty.onDidDismiss();
        console.log(result);
    }

    async saveCompleted() {
        const toast = await this.toastCtrl.create({
            message: 'User is created!',
            position: 'top',
            buttons: ['Dismiss']
        });
        await toast.present();
    }

    async presentAlert() {
        const toast = await this.toastCtrl.create({
            message: 'Passwords do not match, please try again',
            position: 'top',
            buttons: ['Dismiss']
        });
        await toast.present();
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
        console.log(message);
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
