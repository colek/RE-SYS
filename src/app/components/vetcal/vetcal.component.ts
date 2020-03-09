import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SharingService } from '../../services/sharing-service.service';
import { ReasonService } from '../../services/reason.service';
import { EventService } from '../../services/event.service';
import { AvailabilityService } from '../../services/availability.service';
import { User, UserEvent, ObjectManager, MyEvent, Availability, MyBusinessHours, Reason, ServerEvent, EventDateTime } from '../../classes/my-classes';
import { IEventResponse, IAvailability } from '../../classes/my-interface';
import { CalendarService } from '../../services/calendar-service.service';
import { DateClicked } from '../Modals/DateClicked/DateClicked.component';
import { CommonAlert } from '../Modals/CommonAlert/CommonAlert.component';
import { DialogService } from 'primeng/dynamicdialog';
import { isNullOrUndefined } from 'util';

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
  Availabilities: IAvailability[];
  AvailabilityExceptions: Availability[];
  Reasons: Reason[];
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

    setTimeout(() => { this.RefreshEvents() }, 6000);
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

      this.events = await this.GetEvents();
      if (this.events == null) return;

      let availData = await this.GetAvailabilities();
      this.Availabilities = ObjectManager.setExtraAvailData(this.Availabilities, availData);

      let altAvailData = await this.GetAltAvailabilities();
      this.AvailabilityExceptions = ObjectManager.setExtraAvailData(this.AvailabilityExceptions, altAvailData);

      this.SetCalendarAvailability(this.Availabilities, this.AvailabilityExceptions);
    }



    this.ProgressActive = false;
  }

  /** Get events from server */
  async GetEvents(): Promise<MyEvent[]> {
    let data: IEventResponse = await this._eventService.GetEvents(this._sharingService.CurrentCalendar.id);
    if (data == null) return null;

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

  DateClicked(event: any) {
    console.log("DateClicked || date: " + event.dateStr);

    if (!ObjectManager.checkChoosedDate(this.Availabilities, event.date, 15)) {
      this._dialogService.open(CommonAlert, {
        data: {
          message: "Ve zvoleném časce bychom se Vám nemohli věnovat"
        },
        header: 'Zvolený den a čas nelze vybrat',
        width: '40%'
      });
      return false;
    }

    this._sharingService.CurrentUserEvent.ChoosedDate = event.date;

    let ref = this._dialogService.open(DateClicked, {
      header: 'Zvolte podrobnosti',
      width: '30%'
    });

    let dialogClosed = ref.onClose
      .subscribe((data) => {
        if (data) this.WriteNewEvent();
      });
  }

  async WriteNewEvent() {

    let serverEvent = this.UserEventToServerEvent(this._sharingService.CurrentUserEvent);

    let serverEvents = await this.AddNewEvent(serverEvent, this._sharingService.CurrentUserEvent.Email);
    if (isNullOrUndefined(serverEvents) || isNullOrUndefined(serverEvents.events)) return;

    this.events = ObjectManager.SetServerEventsToEvents(serverEvents.events);
  }


  UserEventToServerEvent(userEvent: UserEvent) {
    let ev: ServerEvent = new ServerEvent();

    ev.description = this._sharingService.CurrentUserEvent.Identification + "<br />" + this._sharingService.CurrentUserEvent.Email + "<br />" + this._sharingService.CurrentUserEvent.Phone + "<br />" + this._sharingService.CurrentUserEvent.Reason.name;
    ev.start = new EventDateTime();
    ev.start.dateTime = this._sharingService.CurrentUserEvent.ChoosedDate;
    ev.end = new EventDateTime();
    ev.end.dateTime = new Date(ev.start.dateTime);//.add(15, 'minutes').toDate();
    ev.end.dateTime.setMinutes(ev.end.dateTime.getMinutes() + this._sharingService.CurrentUserEvent.Reason.orderDuration);
    ev.summary = "Rezervovaný termín";


    if (!ObjectManager.checkChoosedDate(this.Availabilities, ev.start.dateTime, this._sharingService.CurrentUserEvent.Reason.orderDuration)) {
      // this._modalService.open(this.message, { size: "sm" });
      this._dialogService.open(CommonAlert, {
        data: {
          message: "Ve zvoleném časce bychom se Vám nemohli věnovat"
        },
        header: 'Zvolený den a čas nelze vybrat',
        width: '40%'
      });
      return null;
    }

    return ev;
  }


  async AddNewEvent(event: ServerEvent, email: string) {

    let eventAdded = await this._eventService.AddEvent(event, email);
    if (eventAdded.inError) {
      this._dialogService.open(CommonAlert, {
        data: {
          message: "Ve zvoleném časce bychom se Vám nemohli věnovat"
        },
        header: 'Zvolený den a čas nelze vybrat',
        width: '40%'
      });

      return null;
    }
    return eventAdded;
  }

  async RefreshEvents() {
    this.ProgressActive = true;

    this.events = await this.GetEvents();

    this.ProgressActive = false;
    setTimeout(() => { this.RefreshEvents() }, 6000);
  }


}