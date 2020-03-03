import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { ServerEvent, ActionType, EventResponse } from '../classes/my-classes';
import { SharingService } from './sharing-service.service';
import { map, catchError } from 'rxjs/operators';
import { IService, IEventResponse } from '../classes/my-interface';
import { Observable } from 'rxjs';

@Injectable()
export class EventService implements IService {
  servicePrefix: string = 'Event';
  constructor(private _http: HttpClient, private _sharingService: SharingService) { }


  async GetEvents(calId: number): Promise<IEventResponse> {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + calId);

    let headers = this._sharingService.createHeaders();
    return await this._http.post<IEventResponse>(addr, this._sharingService.getCurrentStateJson(), { headers: headers }).toPromise();
  }

  // getEvent(objId: string) {
  //   let addr = this._sharingService.getAddress(this.servicePrefix +
  //     '/' + this._sharingService.currentCalendar.id);

  //   let headers = this._sharingService.createHeaders();
  //   this._sharingService.currentState.event = new ServerEvent();
  //   this._sharingService.currentState.event.id = objId;
  //   return this._http.post(addr, this._sharingService.getCurrentStateJson(null, ActionType.AddEvent), {
  //     headers: headers
  //   })
  //     .pipe(
  //       map((res: Response) => res.json()),
  //       catchError(err => new function() { this._sharingService.handleError(err);})
  //     )
  // }

  // -----------------

  addEvent(obj: ServerEvent, email: string) {
    let headers = this._sharingService.createHeaders();
    this._sharingService.CurrentState.event = obj;
    this._sharingService.CurrentState.UserEmail = email;
    return this._http.post<IEventResponse>(this._sharingService.getAddress(this.servicePrefix + "/" + this._sharingService.CurrentCalendar.id),
      this._sharingService.getCurrentStateJson(null, ActionType.AddEvent), {
      headers: headers
    }).pipe();
  }




  editEvent(obj: ServerEvent) {
    let strAddr = this._sharingService.getAddress(this.servicePrefix + '/' + this._sharingService.CurrentCalendar.id);
    let headers = this._sharingService.createHeaders();
    this._sharingService.CurrentState.event = obj;
    return this._http.post<IEventResponse>(strAddr, this._sharingService.getCurrentStateJson(null, ActionType.EditEvent), {
      headers: headers
    }).pipe();
  }

  //---------------------DELETE 

  deleteEvent(id: string) {
    let objAddr = this._sharingService.getAddress(this.servicePrefix + '/' + this._sharingService.CurrentCalendar.id);
    let headers = this._sharingService.createHeaders();
    this._sharingService.CurrentState.event = new ServerEvent();
    this._sharingService.CurrentState.event.id = id;
    return this._http.post<IEventResponse>(objAddr, this._sharingService.getCurrentStateJson(null, ActionType.DeleteEvent), {
      headers: headers
    }).pipe();
  }
}
