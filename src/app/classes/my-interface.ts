import {  } from 'primeng/calendar/primeng-calendar';
import { ChoosedDate, ActionType, ServerEvents, ServerEvent } from './my-classes';
// import { Timestamp } from 'rxjs/operators/timestamp';

// response
export interface IEventResponse {
    events: ServerEvents;
    currentEvent: ServerEvent;
    inError: boolean;
    errorDescription: string;
}

// calendar
export interface ICalendar {
     id: number;
     identification: string;
     description: string;
     mainCalendarId: string;
     fileName: string;
     serviceAccountEmail: string;
     name: string;

     availability: IAvailability[];
     reasons: IReasons[];
}

export interface IAvailability {
     id: number;
     calId: number;
     standard: number;
     weekday: number;
     timeStart: any;//Timespan;
     timeEnd: any//Timespan;
     dateFrom: string;
     dateTo: string;

     dateFromDate: ChoosedDate;
     dateToDate: ChoosedDate;

     cal: ICalendar;

     weekDayStr: string;
    // private _weekDay: number;

    // get weekday(): number {
    //     return this._weekDay;
    // }
    // set weekday(theBar: number) {
    //     this._weekDay = theBar;
    //     this.weekDayStr = this.getWeekDay();
    // }

}

export interface IMyBusinessHours {
     dow: number[];
     start: string;
     end: string;
}

export interface CurrentState {
     calendarId: number;
     dateFrom: Date | string;
     dateTo: Date | string;
     event: IServerEvent;
     type: ActionType;
}

export interface IServerEvent {
     id: string;
     description: string;
     summary: string;
     end: EventDateTime;
     start: EventDateTime;
}

export interface IMyEvent {
    start: string | Date;
    [x: string]: any;
    constraint?: any;//Timespan | BusinessHours;
    end?: string | Date;
    id?: any; // String/number
    title: string;
    allDay?: boolean;
    url?: string;
    interfaceName?: string | string[];
    editable?: boolean;
    startEditable?: boolean;
    durationEditable?: boolean;
    rendering?: string;
    overlap?: boolean;
    source?: EventSource;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}

export interface IUserEvent {
    Identification: string;
    Email: string;
    Phone: string;
    Reason: IReasons;
    ChoosedDate: any;//NgbDateStruct;
    ChoosedTime: any;//NgbTimeStruct;
}

export interface IServerEvents {
     accessRole: string;
     defaultReminders: any[];
     description: string;
     eTag: string;
     items: IServerEvent[];
     kind: string;
     nextPageToken: string;
     nextSyncToken: string;
     summary: string;
     timeZone: string;
     updatedRaw: string;
     updated: Date;
}

export interface EventDateTime {
     dateTime: Date;
}

// personal
export interface IUser {
     id: number;
     name: string;
     surname: string;
     lastLogTime: Date;
     created: Date;
     logged: boolean;
     isActive: boolean;
     login: string;
     password: string;

     client: Client;
     userData: IUserData;
     userRights: IRights[];
}

export interface IRights {
     id: number;
     name: string;
     description: string;
}

export interface UserRights {
     rightId: number;
     userId: number;
     assignedDate: Date;

     right: IRights;
     user: IUser;
}

export interface IUserData {
     userId: number;
     phone: string;
     email: string;
     addressCity: string;
     addressStreet: string;
     addressZip: string;
     addressStreetNum: string;

     user: IUser;
}

// veterina
export interface IClientIllness {
     illnessId: number;
     userId: number;
     id: number;
     dayFound: Date;

     idNavigation: IClientIllnessRecord;
     illness: IIllness;
     user: Client;
}

export interface IClientIllnessRecord {
     id: number;
     created: Date;
     description: string;

     clientIllness: IClientIllness[];
}

export interface IIllness {
     id: number;
     name: string;
     code: string;

     clientIllness: IClientIllness[];
}

export interface Client {
     userId: number
     petTypeId: number;
     lastVisit: Date;
     petName: string;
     description: string;
     nextVisit: Date;

     petType: IPetType;
     user: IUser;
     clientIllness: IClientIllness[];
}

export interface IPetType {
     id: number;
     name: string;

     Client: Client[];
}

// export interface Availability {
//      id: number;
//      calId: number;
//      standard: boolean;
//      weekday: number;
//      timeStart: string;
//      timeEnd: string;
//      dateFrom: Date;
//      dateTo: Date;

//      calendar: Calendar;
// }

export interface IReasons {
     id: number;
     calId: number;
     name: string;
     orderDuration: number;

     calendar: ICalendar;
}


export interface IService {
    servicePrefix: string;
}