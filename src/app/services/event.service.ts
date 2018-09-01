import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { IService, ServerEvent, ActionType } from '../classes/my-classes';
import { SharingService } from './sharing-service.service';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class EventService implements IService {
  servicePrefix: string = 'Event';
  constructor(private _http: Http, private _sharingService: SharingService) { }


  getEvents(calId: number) {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + calId);

    let headers = this._sharingService.createHeaders();
    return this._http.post(addr, this._sharingService.getCurrentStateJson(), { headers: headers })
      .pipe(
        map((res: Response) => res.json()),
        catchError(this._sharingService.handleError)
      )
  }

  getEvent(objId: string) {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + this._sharingService.currentCalendar.id);

    let headers = this._sharingService.createHeaders();
    this._sharingService.currentState.event = new ServerEvent();
    this._sharingService.currentState.event.id = objId;
    return this._http.post(addr, this._sharingService.getCurrentStateJson(null, ActionType.AddEvent), {
      headers: headers
    })
      .pipe(
        map((res: Response) => res.json()),
        catchError(this._sharingService.handleError)
      )
  }

  // -----------------

  addEvent(obj: ServerEvent) {
    let headers = this._sharingService.createHeaders();
    this._sharingService.currentState.event = obj;
    return this._http.post(this._sharingService.getAddress(this.servicePrefix + "/" + this._sharingService.currentCalendar.id),
      this._sharingService.getCurrentStateJson(null, ActionType.AddEvent), {
        headers: headers
      })
      .pipe(
        map((res: Response) => res.json()),
        catchError(this._sharingService.handleError)
      )
  }




  editEvent(obj: ServerEvent) {
    let strAddr = this._sharingService.getAddress(this.servicePrefix + '/' + this._sharingService.currentCalendar.id);
    let headers = this._sharingService.createHeaders();
    this._sharingService.currentState.event = obj;
    return this._http.post(strAddr, this._sharingService.getCurrentStateJson(null, ActionType.EditEvent), {
      headers: headers
    })
      .pipe(
        map((res: Response) => console.log(JSON.stringify(res))),
        catchError(this._sharingService.handleError)
      )
  }

  //---------------------DELETE 

  deleteEvent(id: string) {
    let objAddr = this._sharingService.getAddress(this.servicePrefix + '/' + this._sharingService.currentCalendar.id);
    let headers = this._sharingService.createHeaders();
    this._sharingService.currentState.event = new ServerEvent();
    this._sharingService.currentState.event.id = id;
    return this._http.post(objAddr, this._sharingService.getCurrentStateJson(null, ActionType.DeleteEvent), {
      headers: headers
    })
      .pipe(
        map((res: Response) => console.log(JSON.stringify(res))),
        catchError(this._sharingService.handleError)
      )
  }
}
