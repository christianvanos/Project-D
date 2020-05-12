import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpclientService } from '../service/httpclient.service';
import { Person } from '../models/person';
import { Message } from '../models/message';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { Relationship } from '../models/relationship';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import {Label, MultiDataSet} from 'ng2-charts';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';

class CardsInterface {
  title: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  providers: [DatePipe]
})
export class FolderPage implements OnInit {
  selectedValue;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)',
        'rgba(248, 64, 22, 1)', 'rgba(189, 81, 144, 1)', 'rgba(81, 99, 189, 1)', 'rgba(81, 189, 124, 1)'],
    },
  ];
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{
      ticks: {
          beginAtZero: true
        }}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['Welke categorie wordt het meest geplaatst'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  ];
  // tslint:disable-next-line:ban-types
  dataFromBackend;
  public folder: string;
  messageRead: { [key: number]: boolean } = {};
  private messageList;
  private allReadMessagesList;
  private allUnreadMessagesList;
  private allUnreadHighLevelList;
  messageShown = true;
  createMessageOpen = false;
  private newCreatedList = [];
  private subjectList = [];
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
    title: '',
    datetimePosted: null,
    subjectName: '',
    level: '',
    uuid: '',
    opened: false
  };

  private relationship: Relationship = {
    username: '',
    uuid: ''
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
          console.log(this.messageList)
          this.allReadMessagesList = this.messageList.readMassages;
          this.allUnreadMessagesList = this.messageList.unreadMassages;
          console.log(this.allReadMessagesList);
          console.log(this.allUnreadMessagesList);
        });
    });
    this.httpclient.getUserFromNeo4J().subscribe(res => {
      this.user = res;
      this.httpclient
          .getAllUnreadHighLevelMessages(this.user.username)
          .subscribe(messages => {
            this.allUnreadHighLevelList = messages;
            console.log(this.allUnreadHighLevelList);
          });
    });
    this.httpclient.getSubjectNames().subscribe((test => this.subjectList.push(test)));
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.createBarChart();
    this.createPieChart();
  }

  createBarChart() {
    if (this.folder === 'Analytics') {
      this.httpclient.getBarChartData().subscribe(data => {
        this.dataFromBackend = data;
        this.barChartData = [];
        this.dataFromBackend.forEach(row => {
          this.barChartData.push(row);
        });
      });
    }
  }

  getCreateMessageSubjectName(){
    return this.message.subjectName != ""? this.message.subjectName: 'Type' ;
  }

  createPieChart() {
    if (this.folder === 'Analytics') {
      this.httpclient.getPieData().subscribe(data => {
        this.dataFromBackend = data;
        this.pieChartData = [];
        this.pieChartLabels = [];
        this.dataFromBackend.data.forEach(row => {
          this.pieChartData.push(row);
        });
        this.dataFromBackend.labels.forEach(row => {
          this.pieChartLabels.push(row);
        });
      });
    }
  }

  getCreateMessageLevel() {
    switch (this.message.level) {
      case '':
        return 'Prioriteit';
        break;
      case 'High':
        return 'Hoog';
        break;
      case 'Medium':
        return 'Neutraal';
        break;
      case 'Low':
        return 'Laag';
        break;
      default:
        return 'Error: Wrong level variable';
        break;
    }
  }

  saveNewUser(data, form: NgForm) {
    if (
      data.role === '' ||
      data.name === '' ||
      data.username === '' ||
      data.password === '' ||
      data.confirmPassword === ''
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

  async setCreateMessageLevel(event) {
    if (this.message.level === '') {
      const popover = await this.popoverController.create({
        component: PopoverComponent,
        event,
        componentProps: {type: 'level'},
        translucent: true
      });
      popover.onDidDismiss().then(result => {
        if (result.data) {
          this.message.level = result.data;
        }
      });
      return await popover.present();
    } else {
      this.message.level = '';
    }
  }

  filter() {
    console.log(this.selectedValue);
    if (this.selectedValue !== null && this.selectedValue !== '' && this.selectedValue !== undefined) {
      this.allUnreadMessagesList = this.messageList.unreadMassages.filter(subject => subject.subjectName === this.selectedValue);
      this.allReadMessagesList = this.messageList.readMassages.filter(subject => subject.subjectName === this.selectedValue);
    }
  }

  removeFilter() {
    this.selectedValue = null;
    this.allReadMessagesList = this.messageList.readMassages;
    this.allUnreadMessagesList = this.messageList.unreadMassages;
  }

  UnreadMessages() {

  }

  toggleLiked(card: any) {

    if (card.icon === 'star') {
      card.icon = 'star-outline';
    } else {
      card.icon = 'star';
    }
  }

  async setCreateMessageSubjectName(event) {
    if (this.message.subjectName === '') {
      const popover = await this.popoverController.create({
        component: PopoverComponent,
        event,
        componentProps: {type: 'subject'},
        translucent: true
      });
      popover.onDidDismiss().then(result => {
        if (result.data) {
          this.message.subjectName = result.data;
        }
      });
      return await popover.present();
    } else {
      this.message.subjectName = '';
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

  getName() {
    return sessionStorage.getItem('name');
  }

  async showUserOptionsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {type: 'user'}
    });
    return await popover.present();
  }

  restartInput() {
    this.message.message = '';
    this.message.level = '';
    this.message.subjectName = '';
    this.message.title = '';
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
        .transform(new Date(), 'dd-MM-yyy hh:mm:ss')
        .toString(),
      subjectName: this.message.subjectName,
      message: this.message.message,
      level: this.message.level,
      opened: true
    };
    this.newCreatedList.push(staticMessage);
    const message = [];
    message.push(this.message);
    this.user.subjectList = Array.from(new Set(message));
    this.httpclient.createLinkUserAndMessage(this.user).subscribe();
    this.closeInput();
  }
}
