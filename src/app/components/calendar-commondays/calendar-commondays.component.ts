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

  async ngOnInit() {
    this.Day = new Availability();
    this.LoadWeekdaysType();
    await this.LoadSavedDays()
  }


  // ngDoCheck() {
  //   //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
  //   //Add 'implements DoCheck' to the class.
  //   if (!this.dataLoaded && (this._sharingService.currentCalendar !== this._sharingService.previousCalendar
  //     || ((this._sharingService.currentCalendar !== null && this._sharingService.currentCalendar !== undefined)))) {

  //     this.dataLoaded = true;
  //     this._sharingService.previousCalendar = this._sharingService.currentCalendar;

  //     this.loadSavedDays();
  //   }
  // }

  async EditCommonDay() {
    await this._availabilityService.EditAvailability(this.Day)
      .catch((ex) => {
        console.error("EditAvailability Error: " + ex);
        return null;
      });

    await this.LoadSavedDays();

    return;
  }

  async SaveCommonDay() {
    this.Day.calId = this._sharingService.CurrentCalendar.id;
    this.Day.standard = 1;
    this.Day.id = undefined;

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
      });

    await this.LoadSavedDays();
  }

  EditDay(day) {
    this.Day = day;
  }

  async LoadSavedDays() {
    let data = await this._availabilityService.GetAvailabilities(this._sharingService.CurrentCalendar.id)
      .catch((ex) => {
        console.error("GetAvailabilities Error: " + ex);
        return null;
      });

    this.DayList = ObjectManager.setAvailData(this.DayList, data);
    this.dataLoaded = true;
  }

  LoadWeekdaysType() {
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
