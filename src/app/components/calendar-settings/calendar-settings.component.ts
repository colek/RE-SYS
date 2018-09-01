import { Component, OnInit } from '@angular/core';
import { Reasons } from '../../classes/my-classes';
import { SharingService } from '../../services/sharing-service.service';
import { ReasonService } from '../../services/reason.service';

@Component({
  selector: 'calendar-settings',
  templateUrl: './calendar-settings.component.html',
  styleUrls: ['./calendar-settings.component.css']
})
export class CalendarSettingsComponent implements OnInit {

  public settingsOpen = false;
  public NewReason: string;
  public NewReasonDuration: number;
  public Reason: Reasons[];
  public dataLoaded: boolean = false;

  constructor(
    private _sharingService: SharingService,
    private _reasonService: ReasonService
  ) { }

  ngOnInit() {
    if (this._sharingService.currentCalendar !== null && this._sharingService.currentCalendar !== undefined) {
      this.getReasons();
    }
  }

  ngDoCheck() {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    if (!this.dataLoaded && (this._sharingService.currentCalendar !== this._sharingService.previousCalendar
      || ((this._sharingService.currentCalendar !== null && this._sharingService.currentCalendar !== undefined)))) {

      this.dataLoaded = true;
      this._sharingService.previousCalendar = this._sharingService.currentCalendar;

      this.getReasons();
    }
  }

  addReason() {
    let addRes: Reasons;
    addRes = new Reasons();
    // addRes.calendar = this._sharingService.currentCalendar;
    addRes.calId = this._sharingService.currentCalendar.id
    addRes.name = this.NewReason;
    addRes.orderDuration = this.NewReasonDuration;


    this._reasonService.addReason(addRes)
      .subscribe(
        data => {
          this.getReasons();
          console.log('Reason added');
        },
        error => console.error('Error: ' + error),
        () => console.log('addReason Completed!')
      );
  }

  getReasons() {
    this._reasonService.getReasons(this._sharingService.currentCalendar.id)
      .subscribe(
        data => {
          this.Reason = data;
          this.dataLoaded = true;
          console.log('Aquired reasons = ' + this.Reason.length);
        },
        error => console.error('Error: ' + error),
        () => console.log('getReasons Completed!')
      );
  }

  deleteReason(event) {
    this._reasonService.deleteReason(event.id)
      .subscribe(
        data => {
          this.getReasons();
          console.log('Reason deleted = ' + event.name);
        },
        error => console.error('Error: ' + error),
        () => console.log('deleteReason Completed!')
      );
  }



}
