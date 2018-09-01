import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { Calendar, CurrentState, ActionType } from '../classes/my-classes';
import { CalendarService } from './calendar-service.service';
import 'rxjs/add/observable/throw';

@Injectable()
export class SharingService {

  Login: string;
  Pwd: string;
  public urlAddr = 'http://resys/api';//'http://localhost:59630/api'; //'http://resys.pharaoh.cz/api'; //'/api'; //'https://192.168.2.221:82/api'; 'http://resys/api'

  public currentCalendar: Calendar;
  public selectedObject: Object;
  public selectedId: string;
  public currentState: CurrentState;
  public previousCalendar: Calendar;

  constructor(private _http: Http) {
    this.LoadDefaultCalendar();
  }

  public setObject(obj: Object) {
    this.selectedObject = obj;
    // this.onChange.trigger(tag);
  }
  getTag<Object>() {
    return this.selectedObject;
  }

  handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'chyba');
  }



  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa(this.Login + ':' + this.Pwd));
  }
  getHeaders(headers: Headers) {
    headers.append('Content-type', 'application/json');
    // headers.append('Content-type', 'application/json');
  }

  createNewHeader() {
    return new Headers();
  }

  getAddress(adr: string) {
    return this.urlAddr + '/' + adr;
  }

  createHeaders() {
    let headers = this.createNewHeader();
    this.getHeaders(headers);
    // this.createAuthorizationHeader(headers);

    return headers;
  }

  getCurrentState(actDate: Date = null, type: ActionType = ActionType.GetEvents) {
    if (this.currentState == null) {
      this.currentState = new CurrentState();
      this.currentState.calendarId = this.currentCalendar.id;
      if (actDate == null && (this.currentState.dateFrom == null || this.currentState.dateTo == null)) {
        this.setStartAdnEndDate(actDate);
      }
    }

    this.currentState.type = type;

    return this.currentState;
  }

  getCurrentStateJson(actDate: Date = null, type: ActionType = ActionType.GetEvents) {
    return JSON.stringify(this.getCurrentState(actDate, type));
  }

  setStartAdnEndDate(actDate: Date) {
    if (actDate == null) {
      actDate = new Date();
    }
    this.currentState.dateFrom = new Date(actDate);
    this.currentState.dateFrom.setDate(actDate.getDate() - 7);
    this.currentState.dateTo = new Date(actDate);
    this.currentState.dateTo.setDate(actDate.getDate() + 7);
  }

  LoadDefaultCalendar() {
    this.getCalendar(1).subscribe(
      data => {
        this.currentCalendar = data;
      },
      error => console.error('Error: ' + error),
      () => console.log('getCalendar Completed!')
    );
  }

  getCalendar(objId: number) {
    let addr = this.getAddress("Calendar/" + objId);
    return this._http.get(addr)
      .map((res: Response) => res.json())
      .catch(this.handleError)

  }

  // getDefaultCalendar(){
  //   this._calendarService.getDefaultCalendar()
  //   .subscribe(
  //     data => {
  //       this.currentCalendar = data;
  //     },
  //     error => console.error('Error: ' + error),
  //     () => console.log('Completed! getDefaultCalendar')
  //     );
  // }

}
