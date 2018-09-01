import { Component, OnInit } from '@angular/core';
import { WeekDay, Availability, SelectObj, ObjectManager } from '../../classes/my-classes';
import { SharingService } from '../../services/sharing-service.service';
import { AvailabilityService } from '../../services/availability.service';

@Component({
  selector: 'calendar-commondays',
  templateUrl: './calendar-commondays.component.html',
  styleUrls: ['./calendar-commondays.component.css']
})
export class CalendarCommondaysComponent implements OnInit {

  DayList: Availability[];
  Day: Availability;
  weekdaySelect: SelectObj[];
  public dataLoaded: boolean = false;

  constructor(
    private _sharingService: SharingService,
    private _availabilityService: AvailabilityService, ) { }

  ngOnInit() {
    this.Day = new Availability();
    this.loadWeekdaysType();
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

  editCommonDay() {
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

  saveCommonDay() {
    this.Day.calId = this._sharingService.currentCalendar.id;
    this.Day.standard = 1;
    this.Day.id = undefined;

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
    this._availabilityService.getAvailabilities(this._sharingService.currentCalendar.id).subscribe(
      data => {
        this.DayList = ObjectManager.setAvailData(this.DayList, data);
        this.dataLoaded = true;
        console.log('loadSavedDays Aquired records = ' + this.DayList.length);
      },
      error => console.error('Error: ' + error),
      () => console.log('loadSavedDays Completed!')
    );
  }

  loadWeekdaysType() {
    this.weekdaySelect = new Array();
    this.keys().forEach(element => {
      this.weekdaySelect.push(new SelectObj(element, WeekDay[element]));
    });
  }

  keys(): Array<string> {
    var keys = Object.keys(WeekDay);
    return keys.slice(keys.length / 2);
  }

}
