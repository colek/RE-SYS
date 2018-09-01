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

  ngOnInit() {
    this.Day = new Availability();
  }

  ngDoCheck() {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    if (!this.dataLoaded && (this._sharingService.currentCalendar !== this._sharingService.previousCalendar
      || ((this._sharingService.currentCalendar !== null && this._sharingService.currentCalendar !== undefined)))) {

      this.dataLoaded = true;
      this._sharingService.previousCalendar = this._sharingService.currentCalendar;

      this.loadSavedDays();
    }
  }

  editAltDay() {
    this._availabilityService.editAvailability(this.Day).subscribe(
      data => {
        this.loadSavedDays();
        console.log('saveCommonDay Day = ' + this.Day);
      },
      error => console.error('Error: ' + error),
      () => console.log('saveCommonDay Completed!')
    );
    return;
  }

  saveAltDay() {
    this.Day.calId = this._sharingService.currentCalendar.id;
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
    this._availabilityService.addAvailability(this.Day).subscribe(
      data => {
        this.loadSavedDays();
        console.log('saveCommonDay Day = ' + this.Day);
      },
      error => console.error('Error: ' + error),
      () => console.log('saveCommonDay Completed!')
    );

  }

  deleteDay(day) {
    this._availabilityService.deleteAvailability(day.id)
      .subscribe(
        data => {
          this.loadSavedDays();
          console.log('Availability deleted = ' + day.id);
        },
        error => console.error('Error: ' + error),
        () => console.log('deleteAvailability Completed!')
      );
  }

  editDay(day) {
    this.Day = day;
  }

  loadSavedDays() {
    this._availabilityService.getAltAvailabilities(this._sharingService.currentCalendar.id).subscribe(
      data => {
        this.DayList = ObjectManager.setExtraAvailData(this.DayList, data);
        this.dataLoaded = true;
        console.log('loadSavedDays Aquired records = ' + this.DayList.length);
      },
      error => console.error('Error: ' + error),
      () => console.log('loadSavedDays Completed!')
    );
  }

}
