
import * as moment from 'moment';
import 'moment/locale/nl';

export class Message {
    id: number;
    postedBy: string;
    message: string;
    read: boolean;
    title: string;
    level: string;
    subjectName: string;
    datetimePosted: string;
    uuid: string;
    opened: boolean;
    liked: boolean;
}
