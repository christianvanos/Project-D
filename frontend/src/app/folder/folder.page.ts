import {Component, OnInit, OnDestroy, Renderer2} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpclientService} from '../service/httpclient.service';
import {Person} from '../models/person';
// import { Feed } from '../models/feed';
import {Message} from '../models/message';
import {ModalController, PopoverController} from '@ionic/angular';
import {PopoverComponent} from '../popover/popover.component';
import {Relationship} from '../models/relationship';
import {ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {AlertController} from '@ionic/angular';
import {DatePipe} from '@angular/common';
import {Label, MultiDataSet} from 'ng2-charts';
import {ChartDataSets, ChartOptions, ChartType, RadialChartOptions} from 'chart.js';
import {SubjectPerson} from '../models/subjectperson';
import {UserModalComponent} from '../user-modal/user-modal.component';
import {interval} from 'rxjs';
import * as moment from 'moment';
import 'moment/locale/nl';



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
export class FolderPage implements OnInit, OnDestroy {
  selectedValue;
  sortselectedValue;
  selectedChart;
  availableCharts = ['Meest geliked', 'Aantal gelezen', 'Aantal berichten'];
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
                'rgba(255,0,0,0.3)',
                'rgba(0,255,0,0.3)',
                'rgba(0,0,255,0.3)',
                'rgba(248, 64, 22, 1)',
                'rgba(189, 81, 144, 1)',
                'rgba(81, 99, 189, 1)',
                'rgba(81, 189, 124, 1)'
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
                anchor: 'end',
                align: 'end'
            }
        }
    };

    public barChartLabels: Label[] = [
        'Welke categorie het meest in wordt geplaatst'
    ];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartData: ChartDataSets[] = [
        {data: [90], label: 'Laden...'}
    ];
    // tslint:disable-next-line:ban-types
    dataFromBackend;
    public folder: string;
    messageRead: { [key: number]: boolean } = {};
    private messageList;
    private feed: Array<Message>;
    private feedStream: Array<Message>;
    public lastFeedUpdate: string;
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
    private updateIntervalSubscription;

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
    ) {
    }

    ngOnInit() {
        this.createFeed();
        this.httpclient
            .getSubjectNames()
            .subscribe(test => this.subjectList.push(test));
        this.folder = this.activatedRoute.snapshot.paramMap.get('id');
        this.createBarChart();
        this.createPieChart();
        this.createRadarChart();


        if (this.folder === 'Feed') {
            const updateInterval = interval(15000);
            // Subscribe to begin publishing values
            this.updateIntervalSubscription = updateInterval.subscribe(n =>
                this.getFeedUpdate());
        }

    }

    ngOnDestroy(): void {
        if (this.folder === 'Feed') { 
            this.updateIntervalSubscription.unsubscribe();
        }
    }

    getCurrentDateTimeToString() {
        const result = this.datePipe
            .transform(new Date(), 'dd-MM-yyyy HH:mm:ss')
            .toString();

        console.log(result);
        return result;
    }

    getFeedUpdate() {
        console.log('updateCall');
        this.httpclient
            .getFeedUpdate(this.lastFeedUpdate)
            .subscribe((res: Message[]) => {
                if (!(res.length === 0)) {

                    const BreakException = {};
                    const index = this.feedStream.map((e) => {
                        return e.id;
                    }).indexOf(-1);

                    if (index !== -1) {
                        try {
                            res.forEach((message) => {
                                if (message.uuid === this.feedStream[index].uuid && this.feedStream[index].id === -1) {
                                    message.opened = this.feedStream[index].opened;
                                    this.feedStream.splice(index, 1);
                                    throw BreakException;
                                }
                            });
                        } catch (e) {
                            if (e !== BreakException) {
                                throw e;
                            }
                        }
                    }

                    this.feedStream = [].concat(res, this.feedStream);
                    this.feed = this.feedStream;
                    this.lastFeedUpdate = this.getCurrentDateTimeToString();
                    this.sort();
                    this.filter();
                }
            });

    }


    createFeed() {
        this.httpclient.getUserFromNeo4J().subscribe(res => {
            this.user = res;
            this.httpclient
                .getAllMessagesFromNeo4j(this.user.username)
                .subscribe((messages: { readMassages: Message[], unReadMassages: Message[] }) => {


                    this.messageList = messages;
                    this.messageList.readMassages.forEach((m) => {
                        m.read = true;
                    });
                    this.messageList.unreadMassages.sort(this.compareDatetime);
                    this.messageList.readMassages.sort(this.compareDatetime);
                    this.feedStream = [].concat(this.messageList.unreadMassages, this.messageList.readMassages);
                    this.feed = this.feedStream;
                    this.lastFeedUpdate = this.getCurrentDateTimeToString();
                    // this.filter();

                });
        });
    }


    getFormattedDatetime(datetime) {
        return moment(datetime).calendar();
    }

    compareDatetime(a: Message, b: Message) {
        if (a.datetimePosted < b.datetimePosted) {
            return 1;
        } else {
            return -1;
        }
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

    getCreateMessageSubjectName() {
        return this.message.subjectName !== '' ? this.message.subjectName : 'Type';
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
            case 'High':
                return 'Hoog';
            case 'Normal':
                return 'Normaal';
            default:
                return 'Error: Wrong level variable';
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
            data.oldPassword === '' ||
            data.newPassword === '' ||
            data.confirmNewPassword === ''
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

    compareLevel(type) {
        return function comparison(a: Message, b: Message) {
            if (type === 'h-l') {
                if (a.read === b.read){
                    if (a.level === b.level) {
                            if(a.datetimePosted < b.datetimePosted){
                                return 2;
                            } else {
                                return 0;
                            }
                        } else {
                            return (a.level > b.level) ? 0 : -1;
                        }

                    } else {
                        return (a.read < b.read) ? 1 : 0;
                    }

            } else {
                if (type === 'l-h') {
                    if (a.read === b.read){
                        if (a.level === b.level) {
                            if(a.datetimePosted < b.datetimePosted){
                                return 2;
                            } else {
                                return 0;
                            }
                        } else {
                            return (a.level < b.level) ? 0 : -1;
                        }

                    } else {
                        return (a.read < b.read) ? 1 : 0;
                    }
                }
            }
        };
    }

    sort() {
        if (
            this.sortselectedValue !== null &&
            this.sortselectedValue !== '' &&
            this.sortselectedValue !== undefined
        ) {
            if (this.sortselectedValue === 'h-l') {
                this.feed = this.feedStream.slice().sort(this.compareLevel('h-l'));
            } else {
                if (this.sortselectedValue === 'l-h') {
                    this.feed = this.feedStream.slice().sort(this.compareLevel('l-h'));
                }
            }

        }

    }


    filter() {
        if (
            this.selectedValue !== null &&
            this.selectedValue !== '' &&
            this.selectedValue !== undefined
        ) {
            this.feed = this.feed.filter(
                subject => subject.subjectName === this.selectedValue
            );
        }
    }

    callFilterSort() {
        this.feed = this.feedStream;
        this.sort();
        this.filter();
    }

    removeFilter() {
        this.selectedValue = null;
        this.feed = this.feedStream;
        this.sort();
    }

    removeSort() {
        this.sortselectedValue = null;
        this.feed = this.feedStream;
        this.filter();
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

    
  removeCharts() {
    this.selectedChart = null;
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
        message.read = true;
        this.messageRead[index] = true;
        this.relationship.username = this.user.username;
        this.relationship.uuid = message.uuid;
        this.relationship.relation = 'READ_MESSAGE';
        console.log(message);
        this.httpclient
            .createRelationshipBetweenExistingNodes(this.relationship)
            .subscribe();
    }

    likeMessage(message) {
        this.relationship.username = this.user.username;
        this.relationship.uuid = message.uuid;
        this.relationship.relation = 'LIKED_MESSAGE';
        this.httpclient
            .createRelationshipBetweenExistingNodes(this.relationship)
            .subscribe();
    }


    sendMessage() {
        const staticMessage = {
            title: this.message.title,
            datetimePosted: new Date(),
            subjectName: this.message.subjectName,
            message: this.message.message,
            level: this.message.level,
            opened: true,
            id: -1,
            read: true,
            postedBy: this.user.name,
            uuid: '-1'
        };
        const toServer = {subject: staticMessage, person: this.user};
        this.httpclient.createMessageInNeo4j(toServer).subscribe((res: { uuid: string }) => {
            staticMessage.uuid = res.uuid;
        });
        this.feedStream = [].concat(staticMessage, this.feedStream);
        this.feed = this.feedStream;
        // this.httpclient.createLinkUserAndMessage(this.user).subscribe();
        this.closeInput();
        this.getFeedUpdate();
    }
}

