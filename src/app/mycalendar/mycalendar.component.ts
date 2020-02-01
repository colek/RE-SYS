import { Component, OnInit, ViewChild, TemplateRef, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { SharingService } from '../services/sharing-service.service';
import { CalendarService } from '../services/calendar-service.service';
import { EventService } from '../services/event.service';
import { ObjectManager, ServerEvent, EventDateTime, MyEvent, UserEvent, EventResponse, User, Reasons, Availability, ChoosedDate, MyBusinessHours } from '../classes/my-classes';
// import { Moment, duration, locale } from 'moment';
import { Time } from '@angular/common';
import { ReasonService } from '../services/reason.service';
import { AvailabilityService } from '../services/availability.service';
import { element } from 'protractor';
import { FullCalendar } from 'primeng/fullcalendar/fullcalendar';

@Component({
  selector: 'my-calendar',
  templateUrl: './mycalendar.component.html',
  styleUrls: ['./mycalendar.component.css']
})
export class MyCalendarComponent implements OnInit, AfterViewInit {

  @ViewChild('fc', null) fc: FullCalendar;

  // @Output() navLinkWeekClick = new EventEmitter<any>();
  calendarOptions: any;
  events: MyEvent[];
  calevents: any[];
  promiseOut: any;
  userEvent: UserEvent = new UserEvent();
  dateDisabled: boolean;
  // clickedTime: Moment;
  loggedUser: User;
  Reasons: Reasons[];
  Availabilities: Availability[];
  AvailabilityExceptions: Availability[];
  resDate: string;
  resTime: string;
  progressValue: number;
  progressVisible: boolean;


  constructor(
    private _sharingService: SharingService,
    private _reasonService: ReasonService,
    private _eventService: EventService,
    // private _modalService: NgbModal,
    private _availabilityService: AvailabilityService,
    ) { 
    }

  ngOnInit() {
    this.loggedUser = new User();
    // if (this._sharingService.currentCalendar == null) {
    //   this.getCalendar(1);
    // }
    // else {
    //   this.getEvents();
    // }

    this.setCalendarConfig();

    // this.userEvent = new UserEvent();
    // this.userEvent.ChoosedDate = { "day": 12, "month": 5, "year": 2018 };
    // this.userEvent.ChoosedTime = { "hour": 10, "minute": 45, "second": 0 };
  }

  ngAfterViewInit() {
    // let elem = document.getElementsByTagName('ng-fullcalendar');
    // this.ucCalendar.options.navLinkWeekClick = function (weekStart: any, jsEvent: Event) {
    //   let detail = { weekStart: weekStart, jsEvent: jsEvent };
    //   var widgetEvent = new CustomEvent('navLinkWeekClick', {
    //     bubbles: true,
    //     detail: detail
    //   });
    //   for (let i = 0; i < elem.length; i++) {
    //     elem[i].dispatchEvent(widgetEvent);
    //   }
    // };
  }

  ngDoCheck() {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    if (this._sharingService.currentCalendar !== this._sharingService.previousCalendar) {
      this._sharingService.previousCalendar = this._sharingService.currentCalendar;
      this.progressValue = 10;
      this.getEvents();
      this.getAvailabilities();
    }
  }

  eventClick(event: any) {
    // this.deleteEvent(event);
    console.log("eventClick");
  }

  updateEvent(event: any) {
    console.log("updateEvent");
  }

  clickButton(event: any) {
    let weekStart = event.data.toDate();
    this._sharingService.setStartAdnEndDate(weekStart);

    // this.setAnotherPossibility();

    this.getEvents();

    console.log("clickButton");
  }

  dayClicked(day: any) {
    console.log("dayClicked");
    let cDay = day.date.toDate();

    let zoneOffset = cDay.getTimezoneOffset() / 60;
    let compareDate = new Date(cDay);
    compareDate.setHours(cDay.getHours() + zoneOffset);
    if (!ObjectManager.checkChoosedDate(this.Availabilities, compareDate, 15)) {
      // this._modalService.open(this.message, { size: "sm" });
      return false;
    }

    this.getReasons();
    this.userEvent.ChoosedDate = { "day": cDay.getDate(), "month": cDay.getMonth() + 1, "year": cDay.getFullYear() };
    this.userEvent.ChoosedTime = { "hour": cDay.getHours() + zoneOffset, "minute": cDay.getMinutes(), "second": 0 };
    // this._modalService.open(this.content, { size: "lg" });

    // this.clickedTime = day.date;

    
  }

  selected(day: any) {
    console.log("selected");
  }

  getEvents() {
    this._eventService.getEvents(this._sharingService.currentCalendar.id)
      .subscribe(
        data => {
            if (data.inError) {
              console.error("Cannot get events. " + data.errorDescription);
            }
            else {
              this.events = ObjectManager.SetServerEventsToEvents(data.events);
              this.progressValue += 700;
              // this.ucCalendar.renderEvents(this.events);
              console.log('Aquired events = ' + this.events.length);
            }
        },
        error => console.error('Error: ' + error),
        () => console.log('getEvents Completed!')
      );
  }

  // getCalendar(id: number) {
  //   this._calendarService.getCalendar(id).subscribe(
  //     data => {
  //       this._sharingService.currentCalendar = data;
  //       this.getEvents();
  //     },
  //     error => console.error('Error: ' + error),
  //     () => console.log('getCalendar Completed!')
  //   );
  // }

  eventConfim(c: any) {
    let ev: ServerEvent = new ServerEvent();

    ev.description = this.userEvent.Identification + "<br />" + this.userEvent.Email + "<br />" + this.userEvent.Phone + "<br />" + this.userEvent.Reason.name;
    ev.start = new EventDateTime();
    ev.start.dateTime = new Date(
      this.userEvent.ChoosedDate.year,
      this.userEvent.ChoosedDate.month - 1,
      this.userEvent.ChoosedDate.day,
      this.userEvent.ChoosedTime.hour,
      this.userEvent.ChoosedTime.minute,
      0);
    ev.end = new EventDateTime();
    ev.end.dateTime = new Date(ev.start.dateTime);//.add(15, 'minutes').toDate();
    ev.end.dateTime.setMinutes(ev.end.dateTime.getMinutes() + this.userEvent.Reason.orderDuration);
    ev.summary = "Rezervovaný termín";


    if (!ObjectManager.checkChoosedDate(this.Availabilities, ev.start.dateTime, this.userEvent.Reason.orderDuration)) {
      // this._modalService.open(this.message, { size: "sm" });
      return false;
    }

    this.setNewEvent(ev, this.userEvent.Email);
    c('Close click');
  }

  setNewEvent(event: ServerEvent, email: string) {

    this._eventService.addEvent(event, email).subscribe(
      data => {
        if (data.inError) {
          console.error("Cannot add an event. " + data.errorDescription);
          // this._modalService.open(this.message, { size: "sm" });
        }
        else {
          this.events = ObjectManager.SetServerEventsToEvents(data.events);     
          // this.ucCalendar.renderEvents(this.events);    
          
          let startTime = new Date(data.currentEvent.start.dateTime);

          this.resTime = startTime.toLocaleTimeString();
          this.resDate = startTime.toLocaleDateString();
          // this._modalService.open(this.confirmation, { size: "sm" });
          
          console.log('setNewEvent Aquired events = ' + this.events.length);
        }
      },
      error => console.error('Error: ' + error),
      () => console.log('getCalendar Completed!')
    );
  }

  // setNewEventOld(eventStart: Moment){
  //   let ev:ServerEvent = new ServerEvent();
  //   let zoneOffset = eventStart.toDate().getTimezoneOffset()/60;
  //   let momentWithoutOffset = eventStart.add(zoneOffset, "hours");

  //   ev.description = "test_" + Date.now.toString();
  //   ev.start = new EventDateTime();
  //   ev.start.dateTime = momentWithoutOffset.toDate();
  //   ev.end = new EventDateTime();
  //   ev.end.dateTime = momentWithoutOffset.add(15, 'minutes').toDate();
  //   ev.summary = "Sum";

  //   this._eventService.addEvent(ev).subscribe(
  //     data => {
  //       this.events = ObjectManager.SetServerEventsToEvents(data);
  //       this.ucCalendar.renderEvents(this.events);
  //       console.log('Aquired events = '+ this.events.length);
  //     },
  //     error => console.error('Error: ' + error),
  //     () => console.log('getCalendar Completed!')
  //   );
  // }


  getAvailabilities() {
    this._availabilityService.getAvailabilities(this._sharingService.currentCalendar.id).subscribe(
      data => {
        this.Availabilities = ObjectManager.setExtraAvailData(this.Availabilities, data);
        this.progressValue += 200;
        this.getAltAvailabilities();
        console.log('getAvailabilities Aquired records = ' + this.Availabilities.length);
      },
      error => console.error('Error: ' + error),
      () => console.log('getAvailabilities Completed!')
    );
  }

  getAltAvailabilities() {
    this._availabilityService.getAltAvailabilities(this._sharingService.currentCalendar.id).subscribe(
      data => {
        this.AvailabilityExceptions = ObjectManager.setExtraAvailData(this.AvailabilityExceptions, data);
        this.progressValue += 100;
        this.setCalendarAvailability();
        console.log('getAvailabilities Aquired records = ' + this.AvailabilityExceptions.length);
      },
      error => console.error('Error: ' + error),
      () => console.log('getAvailabilities Completed!')
    );
  }

  setCalendarAvailability() {
    // this.calendarOptions.locale = "en";
    let bhs: MyBusinessHours[];
    bhs = new Array();
    this.Availabilities.forEach(element => {
      let bh = new MyBusinessHours();
      let dow: number[] = [element.weekday];

      if (element.weekday == 8) {
        dow = [1, 2, 3, 4, 5]
      }
      else if (element.weekday == 9) {
        dow = [6, 7]
      }

      bh.dow = dow;
      bh.start = element.timeStart.toString();
      bh.end = element.timeEnd.toString();

      bhs.push(bh);
      if (this.progressValue >= 100){ 
        setTimeout(() => {
          this.progressVisible = false;
        }, 1500);   
      }
    });

    // vyjimky
    this.AvailabilityExceptions.forEach(element => {
      let dFrom = new Date(element.dateFrom);
      let dTo = new Date(element.dateTo);

      // pokud vyjimka patri do zobrazovaneho intervalu, musi se zapocitat
      if (dFrom < this._sharingService.currentState.dateFrom && dTo < this._sharingService.currentState.dateFrom) {

        let daynum = dFrom.getDay();
        // prochazim dokud jsem ve viditelnem spektru
        while (daynum >= 0) {
          daynum = -1;
        }
      }

    });

    this.calendarOptions = {...this.calendarOptions, businessHours: bhs};
    // this.calendarOptions.businessHours = bhs;
    // [{
    //   dow: [1, 2, 3, 4, 5],
    //   start: "04:00",
    //   end: "10:00"
    // }, {
    //   dow: [1, 2, 3, 4, 5],
    //   start: "18:00",
    //   end: "19:00"
    // },
    // {
    //   dow: [6],
    //   start: "10:00",
    //   end: "16:00"
    // }];


    // this.ucCalendar.fullCalendar("option", this.calendarOptions);
  }

  setCalendarConfig() {

    this.calendarOptions = {...this.calendarOptions,
      allDaySlot: false,
      editable: false,
      height: "auto",
      contentHeight: "auto",
      eventLimit: false,
      defaultView: "agendaWeek",
      locale: 'cs',
      header: {
        left: 'prev,next',
        center: ',title,',
        right: ''
      },
      // minTime: duration("07:00:00"),
      // maxTime: duration("19:00:00"),
      hiddenDays: [0],
      themeSystem: "standard",
      selectable: true,
      selectOverlap: false,
      nowIndicator: true,
      slotLabelFormat: "HH:mm",
      timeFormat: "HH:mm",
      columnFormat: "dddd D. M",
      titleFormat: "D.MMM.YYYY",
      // businessHours: [{
      //   dow: [1, 2, 3, 4, 5],
      //   start: "08:00",
      //   end: "12:00"
      // }, {
      //   dow: [1, 2, 3, 4, 5],
      //   start: "13:00",
      //   end: "18:00"
      // },
      // {
      //   dow: [6],
      //   start: "15:00",
      //   end: "16:00"
      // }
      // ],

      // events: []
    };
  }

  deleteEvent(event: any) {
    this._eventService.deleteEvent(ObjectManager.SetEventToServerEvent(event).id).subscribe(
      data => {
        if (data.inError) {
          console.error("Cannot delete an event. " + data.errorDescription);
        }
        else {
          // console.log(JSON.stringify(evResponse.events));
          this.events = ObjectManager.SetServerEventsToEvents(data.events);
          // this.ucCalendar.renderEvents(this.events);
          console.log("Event deleted.");
        }
      },
      error => console.error('Error: ' + error),
      () => {
        console.log('deleteEvent Completed!');
      }
    );
  }

  getReasons() {
    this._reasonService.getReasons(this._sharingService.currentCalendar.id)
      .subscribe(
        data => {
          this.Reasons = data;
        },
        error => console.error('Error: ' + error),
        () => console.log('getReasons Completed!')
      );
  }


}