import { Component, OnInit, Renderer2 } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpclientService } from "../service/httpclient.service";
import { Person } from "../models/person";
import { Feed } from "../models/feed";
import { Message } from "../models/message";
import {ModalController, PopoverController} from "@ionic/angular";
import { PopoverComponent } from "../popover/popover.component";
import { Relationship } from "../models/relationship";
import { ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ToastController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import { DatePipe } from "@angular/common";
import { Label, MultiDataSet } from "ng2-charts";
import {ChartDataSets, ChartOptions, ChartType, RadialChartOptions} from "chart.js";
import { SubjectPerson } from "../models/subjectperson";
import { UserModalComponent} from '../user-modal/user-modal.component';

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
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  public barChartLabels2: Label[] = ['Welke onderwerpen worden het meest geliked'];

  public barChartData2: ChartDataSets[] = [
    { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
  ];
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
        }
      }
    }
  };
  public pieChartLabels: Label[] = [
    'Laden...'
  ];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: [
        "rgba(255,0,0,0.3)",
        "rgba(0,255,0,0.3)",
        "rgba(0,0,255,0.3)",
        "rgba(248, 64, 22, 1)",
        "rgba(189, 81, 144, 1)",
        "rgba(81, 99, 189, 1)",
        "rgba(81, 189, 124, 1)"
      ]
    }
  ];
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end"
      }
    }
  };
  public barChartLabels: Label[] = [
      "Welke categorie het meest in wordt geplaatst"
  ];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [
    { data: [90], label: "Laden..." }
  ];
  // tslint:disable-next-line:ban-types
  dataFromBackend;
  public folder: string;
  messageRead: { [key: number]: boolean } = {};
  private messageList;
  // private allReadMessagesList;
  // private allUnreadMessagesList;
  // private allUnreadHighLevelList;
  private feed: Array<Message>;
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
  private subjectPerson: SubjectPerson = {
    subject: null,
    person: null
  };
  private testFeed;

  private message: Message = {
    id: null,
    message: '',
    postedBy: '',
    read: false,
    title: '',
    datetimePosted: null,
    subjectName: '',
    level: '',
    uuid: '',
    opened: false
  };

  private relationship: Relationship = {
    username: '',
    uuid: '',
    relation: ''
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpclient: HttpclientService,
    private popoverController: PopoverController,
    private datePipe: DatePipe,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private modalController: ModalController
) {}

  ngOnInit() {
    console.log(this.httpclient);
    this.httpclient.getUserFromNeo4J().subscribe(res => {
      this.user = res;
      this.httpclient
          .getAllMessagesFromNeo4j(this.user.username)
          .subscribe(messages => {
            this.messageList = messages;
            this.messageList.readMassages.forEach((m) => {m.read = true;});
            this.feed =  [];
            this.feed = this.feed.concat(this.messageList.unreadMassages, this.messageList.readMassages);
            console.log(this.feed);
          });
    });

    // this.testFeed = new Feed(this.user.username);
    // console.log('TestFeed...');
    // console.log(this.testFeed.getFeed());
    // this.httpclient.getUserFromNeo4J().subscribe(res => {
    //   this.user = res;
    //   this.httpclient
    //       .getAllUnreadHighLevelMessages(this.user.username)
    //       .subscribe(messages => {
    //         this.allUnreadHighLevelList = messages;
    //         console.log(this.allUnreadHighLevelList);
    //       });
    // });
    // this.httpclient.getSubjectNames().subscribe((test => this.subjectList.push(test)));
    // this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.httpclient
      .getSubjectNames()
      .subscribe(test => this.subjectList.push(test));
    this.folder = this.activatedRoute.snapshot.paramMap.get("id");
    this.createBarChart();
    this.createPieChart();
    this.createRadarChart();
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
          console.log(row);
          this.pieChartData.push(row);
        });
        this.dataFromBackend.labels.forEach(row => {
          this.pieChartLabels.push(row);
        });
      });
      console.log(this.pieChartLabels);
    }
  }

  createRadarChart() {
    if (this.folder === 'Analytics') {
      this.httpclient.getRadarData().subscribe(data => {
        this.dataFromBackend = data;
        this.barChartData2 = [];
        this.dataFromBackend.data.forEach(row => {
          this.barChartData2.push(row);
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
      case 'Normal':
        return 'Normaal';
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
      this.presentPasswordAlert();
    }
  }

  saveNewPassword(data, form: NgForm) {
    if (
        data.oldPassword === "" ||
        data.newPassword === "" ||
        data.confirmNewPassword === ""
    ) {
      this.empty();
    } else if (data.newPassword === data.confirmNewPassword) {
      const changePassword = {
        name: this.user.name,
        username: this.user.username,
        role: this.user.role,
        password: data.confirmNewPassword
      };
      this.httpclient.changePasswordOfuserInNeo4j(changePassword).subscribe();
      form.resetForm();
      this.saveCompleted();
    } else {
      this.presentPasswordAlert();
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
    if (
      this.selectedValue !== null &&
      this.selectedValue !== "" &&
      this.selectedValue !== undefined
    ) {
      this.feed = this.feed.filter(
        subject => subject.subjectName === this.selectedValue
      );
    }
  }

  removeFilter() {
    this.selectedValue = null;
    this.feed = [].concat(this.messageList.unreadMassages, this.messageList.readMassages);
  }

  UnreadMessages() {

  }

  toggleLiked(card: any) {
    if (card.icon === "star") {
      card.icon = "star-outline";
    } else {
      card.icon = "star";
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
      message: 'Oeps, niet alles is ingevuld, probeer het opnieuw!',
      buttons: ['ok']
    });

    await empty.present();
    const result = await empty.onDidDismiss();
    console.log(result);
  }

  async saveCompleted() {
    const toast = await this.toastCtrl.create({
      message: 'Gebruiker is aangemaakt!',
      position: 'top',
      buttons: ['Dismiss']
    });
    await toast.present();
  }

  async presentPasswordAlert() {
    const toast = await this.toastCtrl.create({
      message: 'Wachtwoorden komen niet overeen, probeer het opnieuw.',
      position: 'top',
      buttons: ['Dismiss']
    });
    await toast.present();
  }

  openMessage(index, message) {
    message.opened = true;
    if (!message.read) {
      this.readMessage(index, message);
    }
  }

  closeMessage(message) {
    message.opened = false;
    message.read = true;
  }

  openMessageCreation() {
    this.createMessageOpen = true;
  }

  getName() {
    return sessionStorage.getItem('username');
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
    this.relationship.relation = "READ_MESSAGE";
    console.log(message);
    this.httpclient
      .createRelationshipBetweenExistingNodes(this.relationship)
      .subscribe();
  }

  likeMessage(message) {
    this.relationship.username = this.user.username;
    this.relationship.uuid = message.uuid;
    this.relationship.relation = "LIKED_MESSAGE";
    this.httpclient
      .createRelationshipBetweenExistingNodes(this.relationship)
      .subscribe();
  }

  unLikeMessage(message) {}

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
    const toServer = { subject: staticMessage, person: this.user };
    this.httpclient.createMessageInNeo4j(toServer).subscribe();
    // this.httpclient.createLinkUserAndMessage(this.user).subscribe();
    this.closeInput();
  }
}
