import { DatePipe } from '@angular/common';
import {HttpclientService} from "../service/httpclient.service";
import {Message} from "./message";


export class Feed {
    constructor(
        private datePipe: DatePipe,
        private httpclient: HttpclientService,

    ) {}

    private messages: [];
    private lastUpdate: any;

    Feed(username) {
       // this.httpclient.getUserFromNeo4J().subscribe(res => {
       //      this.httpclient
       //          .getAllMessagesFromNeo4j(username)
       //          .subscribe(messages => {
       //              messages.readMassages.forEach((m) => {
       //                  m.read = true;
       //              });
       //              this.messages = messages.unreadMassages;
       //              this.messages.push(messages.readMassages);
       //          });
       //  });
    }

    Update() {
        this.lastUpdate = this.datePipe
            .transform(new Date(), 'dd-MM-yyy hh:mm:ss');
    }

    getLastUpdateTime(){
        return this.lastUpdate;
    }

    setMessages(){

    }
}
