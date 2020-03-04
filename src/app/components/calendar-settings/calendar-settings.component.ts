import { Component, OnInit } from '@angular/core';
import { Reason } from '../../classes/my-classes';
import { SharingService } from '../../services/sharing-service.service';
import { ReasonService } from '../../services/reason.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'calendar-settings',
  templateUrl: './calendar-settings.component.html',
  styleUrls: ['./calendar-settings.component.css']
})
export class CalendarSettingsComponent implements OnInit {

  public settingsOpen = true;
  public NewReason: string;
  public NewReasonDuration: number;
  public Reasons: Reason[];
  public dataLoaded: boolean = false;

  constructor(
    private _sharingService: SharingService,
    private _reasonService: ReasonService
  ) { }

  async ngOnInit() {
    await this.GetReasons();
  }

  ngDoCheck() {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    // if (!this.dataLoaded && (this._sharingService.CurrentCalendar !== this._sharingService.PreviousCalendar
    //   || ((this._sharingService.CurrentCalendar !== null && this._sharingService.CurrentCalendar !== undefined)))) {

    //   this.dataLoaded = true;
    //   this._sharingService.PreviousCalendar = this._sharingService.CurrentCalendar;

    //   this.getReasons();
    // }
  }

  addReason() {
    let addRes: Reason;
    addRes = new Reason();
    // addRes.calendar = this._sharingService.CurrentCalendar;
    addRes.calId = this._sharingService.CurrentCalendar.id
    addRes.name = this.NewReason;
    addRes.orderDuration = this.NewReasonDuration;


    this._reasonService.AddReason(addRes)
      .catch((ex) => {
        console.error("AddReason Error: " + ex);
        return null;
      });
  }

  async GetReasons() {
    if (isNullOrUndefined(this._sharingService.Reasons)) {
      this._sharingService.Reasons = await this._reasonService.GetReasons();
    }
    this.Reasons = this._sharingService.Reasons;
  }

  deleteReason(event) {
    this._reasonService.DeleteReason(event.id)
      .catch((ex) => {
        console.error("DeleteReason Error: " + ex);
        return null;
      });
  }



}
