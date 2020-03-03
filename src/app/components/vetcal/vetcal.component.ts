import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SharingService } from '../../services/sharing-service.service';
import { ReasonService } from '../../services/reason.service';
import { EventService } from '../../services/event.service';
import { AvailabilityService } from '../../services/availability.service';
import { User, UserEvent, ObjectManager, MyEvent, Availability, MyBusinessHours, Reasons } from '../../classes/my-classes';
import { IEventResponse, IAvailability } from '../../classes/my-interface';
import { CalendarService } from '../../services/calendar-service.service';
import { DateClicked } from '../Modals/DateClicked/DateClicked.component';
import { CommonAlert } from '../Modals/CommonAlert/CommonAlert.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'vetcal',
  templateUrl: './vetcal.component.html',
  styleUrls: ['./vetcal.component.css'],
  providers: [DialogService]
})
export class VetcalComponent implements OnInit {

  events: any;
  options: any;
  loggedUser: User;
  userEvent: UserEvent;
  Availabilities: IAvailability[];
  AvailabilityExceptions: Availability[];
  Reasons: Reasons[];
  ProgressActive: boolean;

  constructor(
    private _sharingService: SharingService,
    private _reasonService: ReasonService,
    private _eventService: EventService,
    private _availabilityService: AvailabilityService,
    private _calendarService: CalendarService,
    private _dialogService: DialogService
  ) { }

  async ngOnInit() {
    this.SetDefaultOptions();
    await this.InitCalendar();
  }

  SetDefaultOptions() {
    this.options = {
      ...this.options,
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      firstDay: 1,
      allDaySlot: false,
      editable: false,
      height: "auto",
      contentHeight: "auto",
      eventLimit: false,
      defaultView: "timeGridWeek",
      locale: 'cs',
      header: {
        left: 'prev,next',
        center: ',title,',
        right: ''
      },
      minTime: "07:00:00",
      maxTime: "19:00:00",
      hiddenDays: [0],
      themeSystem: "standard",
      selectable: true,
      selectOverlap: false,
      nowIndicator: true,
      dateClick: (e) => {
        this.DateClicked(e);
      }
    };
  }

  async InitCalendar() {
    this.ProgressActive = true;

    this.loggedUser = new User();
    if (this._sharingService.CurrentCalendar == null) {
      this._sharingService.CurrentCalendar = await this.GetCalendar(1);
      // add progress TODO
      this.events = await this.GetEvents();
      // add progress TODO
      let availData = await this.GetAvailabilities();
      this.Availabilities = ObjectManager.setExtraAvailData(this.Availabilities, availData);
      // add progress TODO
      let altAvailData = await this.GetAltAvailabilities();
      this.AvailabilityExceptions = ObjectManager.setExtraAvailData(this.AvailabilityExceptions, altAvailData);

      this.SetCalendarAvailability(this.Availabilities, this.AvailabilityExceptions);
    }


    this.userEvent = new UserEvent();
    this.userEvent.ChoosedDate = { "day": 12, "month": 5, "year": 2018 };
    this.userEvent.ChoosedTime = { "hour": 10, "minute": 45, "second": 0 };

    this.ProgressActive = false;
  }

  /** Get events from server */
  async GetEvents(): Promise<MyEvent[]> {
    let data: IEventResponse = await this._eventService.GetEvents(this._sharingService.CurrentCalendar.id)
      .catch(error => {
        console.error("GetEvents Error: " + error);
        return null;
      });

    if (data.inError) {
      console.error("Cannot get events. " + data.errorDescription);
    };


    // console.log('Aquired events = ' + this.events.length);
    return ObjectManager.SetServerEventsToEvents(data.events);
  }

  /** Load calendar from server */
  async GetCalendar(id: number) {
    return await this._calendarService.GetCalendar(id)
      .catch(error => {
        console.error("GetCalendar Error: " + error);
        return null;
      });
  }


  async GetAvailabilities() {
    return await this._availabilityService.GetAvailabilities(this._sharingService.CurrentCalendar.id)
      .catch((error) => {
        console.error("GetAvailabilities Error: " + error);
        return null;
      });
  }

  async GetAltAvailabilities() {
    return await this._availabilityService.GetAltAvailabilities(this._sharingService.CurrentCalendar.id)
      .catch((ex) => {
        console.error("GetAltAvailabilities Error: " + ex);
        return null;
      });
  }

  /** Sets all availabilities for calendar to options */
  SetCalendarAvailability(availabilities: IAvailability[], availExceptions: IAvailability[]) {
    let bhs: MyBusinessHours[];
    bhs = new Array();

    for (const element of availabilities) {
      let bh = new MyBusinessHours();
      let dow: number[] = [element.weekday];

      if (element.weekday == 8) {
        dow = [1, 2, 3, 4, 5]
      }
      else if (element.weekday == 9) {
        dow = [6, 7]
      }

      bh.daysOfWeek = dow;
      bh.startTime = element.timeStart.toString();
      bh.endTime = element.timeEnd.toString();

      bhs.push(bh);
    }

    // vyjimky

    for (const element of availExceptions) {

      let dFrom = new Date(element.dateFrom);
      let dTo = new Date(element.dateTo);

      // pokud vyjimka patri do zobrazovaneho intervalu, musi se zapocitat
      if (dFrom < this._sharingService.CurrentState.dateFrom && dTo < this._sharingService.CurrentState.dateFrom) {

        let daynum = dFrom.getDay();
        // prochazim dokud jsem ve viditelnem spektru
        while (daynum >= 0) {
          daynum = -1;
        }
      }

    }

    this.options = { ...this.options, businessHours: bhs };
  }

  async DateClicked(event: any) {
    console.log("DateClicked || date: " + event.dateStr);

    // let cDay = event.date;

    // let zoneOffset = cDay.getTimezoneOffset() / 60;
    // let compareDate = new Date(cDay);
    // compareDate.setHours(cDay.getHours() + zoneOffset);
    if (!ObjectManager.checkChoosedDate(this.Availabilities, event.date, 15)) {
      this._dialogService.open(CommonAlert, {
        header: 'Zvolený den a čas nelze vybrat',
        width: '40%'
      });
      return false;
    }

    this.Reasons = await this.GetReasons();
    this.userEvent.ChoosedDate = { "day": event.date.getDate(), "month": event.date.getMonth() + 1, "year": event.date.getFullYear() };
    this.userEvent.ChoosedTime = { "hour": event.date.getHours(), "minute": event.date.getMinutes(), "second": 0 };
    this._dialogService.open(DateClicked, {
      header: 'Zvolte podrobnosti',
      width: '70%'
    })


    // this._modalService.open(this.content, { size: "lg" });

    // this.clickedTime = day.date;


  }


  async GetReasons() {
    return await this._reasonService.GetReasons(this._sharingService.CurrentCalendar.id)
      .catch((ex) => {
        console.error("GetReasons Error: " + ex);
        return null;
      });
  }

}