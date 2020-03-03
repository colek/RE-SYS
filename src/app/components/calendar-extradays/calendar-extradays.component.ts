import { Component, OnInit } from '@angular/core';
import { Availability, ObjectManager } from '../../classes/my-classes';
import { SharingService } from '../../services/sharing-service.service';
import { AvailabilityService } from '../../services/availability.service';


@Component({
  selector: 'calendar-extradays',
  templateUrl: './calendar-extradays.component.html',
  styleUrls: ['./calendar-extradays.component.css']
})
export class CalendarExtradaysComponent implements OnInit {

  DayList: Availability[];
  Day: Availability;
  public dataLoaded: boolean = false;


  constructor(
    private _sharingService: SharingService,
    private _availabilityService: AvailabilityService) { }

  async ngOnInit() {
    this.Day = new Availability();
    await this.LoadSavedDays();
  }

  // ngDoCheck() {
  //   //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
  //   //Add 'implements DoCheck' to the class.
  //   if (!this.dataLoaded && (this._sharingService.CurrentCalendar !== this._sharingService.PreviousCalendar
  //     || ((this._sharingService.CurrentCalendar !== null && this._sharingService.CurrentCalendar !== undefined)))) {

  //     this.dataLoaded = true;
  //     this._sharingService.PreviousCalendar = this._sharingService.CurrentCalendar;

  //     this.LoadSavedDays();
  //   }
  // }

  async EditAltDay() {
    await this._availabilityService.EditAvailability(this.Day).
      catch((ex) => {
        console.error("EditAvailability Error: " + ex);
        return null;
      });

    await this.LoadSavedDays()
      .catch((ex) => {
        console.error("LoadSavedDays Error: " + ex);
        return null;
      });

    return;
  }

  async SaveAltDay() {
    this.Day.calId = this._sharingService.CurrentCalendar.id;
    this.Day.standard = 0;
    this.Day.id = undefined;
    this.Day.weekday = 10000;

    //nastavit offset
    let xdate = new Date();
    let offset = -xdate.getTimezoneOffset() / 60;

    // aplikovat datumy
    let fromDate = new Date(this.Day.dateFromDate.year, this.Day.dateFromDate.month - 1, this.Day.dateFromDate.day, 0 + offset);
    this.Day.dateFrom = fromDate.toUTCString();

    let toDate = new Date(this.Day.dateToDate.year, this.Day.dateToDate.month - 1, this.Day.dateToDate.day, 0 + offset);
    this.Day.dateTo = toDate.toUTCString();

    //odeslat
    this._availabilityService.AddAvailability(this.Day)
      .catch((ex) => {
        console.error("AddAvailability Error: " + ex);
        return null;
      });

    await this.LoadSavedDays();

  }

  async DeleteDay(day) {
    this._availabilityService.DeleteAvailability(day.id)
      .catch((ex) => {
        console.error("DeleteAvailability Error: " + ex);
        return null;
      })

    await this.LoadSavedDays();
  }

  EditDay(day) {
    this.Day = day;
  }

  async LoadSavedDays() {
    let dayList = await this._availabilityService.GetAltAvailabilities(this._sharingService.CurrentCalendar.id)
      .catch((ex) => {
        console.error("GetAvailabilities Error: " + ex);
        return null;
      });
    this.DayList = ObjectManager.setExtraAvailData(this.DayList, dayList);

  }

}
