// import { DatePipe } from '@angular/common';
// import {HttpclientService} from "../service/httpclient.service";
// import {Message} from "./message";
//
// class ResultMessages {
//     readMassages: Message[];
//     unreadMassages: Message[];
// }
//
//
// export class Feed  {
//     constructor(
//         private httpclient: HttpclientService,
//         private username: string
//     ) {
//         console.log(this.httpclient);
//         this.httpclient.getUserFromNeo4J().subscribe(res => {
//             this.httpclient
//                 .getAllMessagesFromNeo4j(this.username)
//                 .subscribe((messages: ResultMessages) => {
//                     messages.readMassages.forEach((m) => {
//                         m.read = true;
//                     });
//                     this.messages = this.messages.concat(messages.unreadMassages, messages.readMassages);
//                 });
//         });
//     }
//     private datePipe: DatePipe;
//
//     private messages: Message[];
//     private lastUpdate: any;
//
//     Update() {
//         this.lastUpdate = this.datePipe
//             .transform(new Date(), 'dd-MM-yyy hh:mm:ss');
//
//         return this.messages;
//     }
//
//     getFeed() {
//         return this.messages;
//     }
//
//     getLastUpdateTime() {
//         return this.lastUpdate;
//     }
//
//     newMessage(message){
//
//     }
//
//     setMessages(){
//
//     }
// }
