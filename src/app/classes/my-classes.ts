import { Component, Injectable } from '@angular/core'
// import { EventObject, Timespan, BusinessHours } from 'fullcalendar';
// import { NgbTimeStruct, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
//import { Timestamp } from 'rxjs/operators/timestamp';

// response
export class EventResponse {
    public events: ServerEvents;
    public event: ServerEvent;
    public inError: boolean;
    public errorDescription: string;
}

// calendar
export class Calendar {
    public id: number;
    public identification: string;
    public description: string;
    public mainCalendarId: string;
    public fileName: string;
    public serviceAccountEmail: string;
    public name: string;

    public availability: Availability[];
    public reasons: Reasons[];
}

export class Availability {
    public id: number;
    public calId: number;
    public standard: number;
    public weekday: number;
    public timeStart: any;//Timespan;
    public timeEnd: any; //Timespan;
    public dateFrom: string;
    public dateTo: string;

    public dateFromDate: ChoosedDate;
    public dateToDate: ChoosedDate;

    public cal: Calendar;

    public weekDayStr: string;
    // private _weekDay: number;

    // get weekday(): number {
    //     return this._weekDay;
    // }
    // set weekday(theBar: number) {
    //     this._weekDay = theBar;
    //     this.weekDayStr = this.getWeekDay();
    // }

}

export class MyBusinessHours {
    public dow: number[];
    public start: string;
    public end: string;
}

export class CurrentState {
    public calendarId: number;
    public dateFrom: Date | string;
    public dateTo: Date | string;
    public event: ServerEvent;
    public type: ActionType;
    public UserEmail: string;
}

export enum ActionType {
    GetEvents = 0,
    GetEvent = 1,
    AddEvent = 2,
    EditEvent = 3,
    DeleteEvent = 4
}

export enum WeekDay {
    Pondělí = 1,
    Úterý = 2,
    Středa = 3,
    Čtvrtek = 4,
    Pátek = 5,
    Sobota = 6,
    Neděle = 7,
    "Po-Pá" = 8,
    "So-Ne" = 9
}

export class ServerEvent {
    public id: string;
    public description: string;
    public summary: string;
    public end: EventDateTime;
    public start: EventDateTime;
}

export class MyEvent {
    start: string | Date;
    [x: string]: any;
    constraint?: any; //Timespan | BusinessHours;
    end?: string | Date;
    id?: any; // String/number
    title: string;
    allDay?: boolean;
    url?: string;
    className?: string | string[];
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

export class UserEvent {
    Identification: string;
    Email: string;
    Phone: string;
    Reason: Reasons;
    ChoosedDate: any; //NgbDateStruct;
    ChoosedTime: any; // NgbTimeStruct;
}

export class ServerEvents {
    public accessRole: string;
    public defaultReminders: any[];
    public description: string;
    public eTag: string;
    public items: ServerEvent[];
    public kind: string;
    public nextPageToken: string;
    public nextSyncToken: string;
    public summary: string;
    public timeZone: string;
    public updatedRaw: string;
    public updated: Date;
}

export class EventDateTime {
    public dateTime: Date;
}

// personal
export class User {
    public id: number;
    public name: string;
    public surname: string;
    public lastLogTime: Date;
    public created: Date;
    public logged: boolean;
    public isActive: boolean;
    public login: string;
    public password: string;

    public client: Client;
    public userData: UserData;
    public userRights: Rights[];
}

export class Rights {
    public id: number;
    public name: string;
    public description: string;
}

export class UserRights {
    public rightId: number;
    public userId: number;
    public assignedDate: Date;

    public right: Rights;
    public user: User;
}

export class UserData {
    public userId: number;
    public phone: string;
    public email: string;
    public addressCity: string;
    public addressStreet: string;
    public addressZip: string;
    public addressStreetNum: string;

    public user: User;
}

// veterina
export class ClientIllness {
    public illnessId: number;
    public userId: number;
    public id: number;
    public dayFound: Date;

    public idNavigation: ClientIllnessRecord;
    public illness: Illness;
    public user: Client;
}

export class ClientIllnessRecord {
    public id: number;
    public created: Date;
    public description: string;

    public clientIllness: ClientIllness[];
}

export class Illness {
    public id: number;
    public name: string;
    public code: string;

    public clientIllness: ClientIllness[];
}

export class Client {
    public userId: number
    public petTypeId: number;
    public lastVisit: Date;
    public petName: string;
    public description: string;
    public nextVisit: Date;

    public petType: PetType;
    public user: User;
    public clientIllness: ClientIllness[];
}

export class PetType {
    public id: number;
    public name: string;

    public Client: Client[];
}

// export class Availability {
//     public id: number;
//     public calId: number;
//     public standard: boolean;
//     public weekday: number;
//     public timeStart: string;
//     public timeEnd: string;
//     public dateFrom: Date;
//     public dateTo: Date;

//     public calendar: Calendar;
// }

export class Reasons {
    public id: number;
    public calId: number;
    public name: string;
    public orderDuration: number;

    public calendar: Calendar;
}


export class SelectObj {
    public name: string;
    public value: any;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = value
    }
}

export class ChoosedDate {
    public day: number;
    public month: number;
    public year: number;
}

export class ObjectManager {
    public static SetServerEventToEvent(sevent: ServerEvent) {
        let aevent: MyEvent;

        aevent = new MyEvent();
        aevent.id = sevent.id;
        aevent.title = sevent.summary;
        aevent.start = sevent.start.dateTime;
        aevent.end = sevent.end.dateTime;

        return aevent;
    }

    public static SetEventToServerEvent(aevent: any) {
        let sevent: ServerEvent;

        sevent = new ServerEvent();
        sevent.id = aevent.event.id;
        sevent.start = new EventDateTime();
        sevent.start.dateTime = aevent.event.start as Date;
        sevent.end = new EventDateTime();
        sevent.end.dateTime = aevent.event.end as Date;
        sevent.summary = aevent.event.title;

        return sevent;
    }

    public static SetServerEventsToEvents(events: ServerEvents): MyEvent[] {
        let toEvents: MyEvent[];
        toEvents = new Array();
        if (events.items.length <= 0) return toEvents;
        events.items.forEach(e => {
            toEvents.push(this.SetServerEventToEvent(e));
        });

        return toEvents;
    }

    public static setExtraAvailData(list: Availability[], data): Availability[] {
        list = data;
        list.forEach(element => {
            let dayf = new Date(element.dateFrom);
            element.dateFromDate = new ChoosedDate();
            element.dateFromDate.day = dayf.getDate();
            element.dateFromDate.month = dayf.getMonth() + 1;
            element.dateFromDate.year = dayf.getFullYear();

            let dayt = new Date(element.dateTo);
            element.dateToDate = new ChoosedDate();
            element.dateToDate.day = dayt.getDate();
            element.dateToDate.month = dayt.getMonth() + 1;
            element.dateToDate.year = dayt.getFullYear();
        });

        return list;
    }

    public static setAvailData(list: Availability[], data): Availability[] {
        list = data;
        list.forEach(element => {
            element.weekDayStr = this.getWeekDay(element.weekday);
        });

        return list;
    }

    public static getWeekDay(weekDay: number) {
        let xday = WeekDay[weekDay];
        return xday;
    }

    public static checkChoosedDate(availabilities: Availability[], date: Date, offset: number) {

        // let zoneOffset = date.getTimezoneOffset() / 60;
        let wDay = date.getDay();
        let tStart = new Date(date);
        tStart.setHours(tStart.getHours());

        let endDateTime = new Date(date);//.add(15, 'minutes').toDate();
        endDateTime.setHours(endDateTime.getHours());
        endDateTime.setMinutes(endDateTime.getMinutes() + offset);
        let tEnd = endDateTime;

        let output = false;

        availabilities.forEach(element => {
            // shoda dne
            if (element.weekday == wDay
                || (element.weekday == 8 && wDay >= 1 && wDay <= 5)
                || (element.weekday == 9 && wDay >= 6 && wDay <= 7)) {
                let curStart = new Date(date);
                let splittedTime = element.timeStart.toString().split(":");
                curStart.setHours(+splittedTime[0]);
                curStart.setMinutes(+splittedTime[1]);
                curStart.setSeconds(+splittedTime[2]);

                let curEnd = new Date(date);
                let splittedEndTime = element.timeEnd.toString().split(":");
                curEnd.setHours(+splittedEndTime[0]);
                curEnd.setMinutes(+splittedEndTime[1]);
                curEnd.setSeconds(+splittedEndTime[2]);


                if (curStart <= tStart && curEnd >= tEnd) {
                    output = true;
                    return;
                }
            }
        });

        return output;
    }


}