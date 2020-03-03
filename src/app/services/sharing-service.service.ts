import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Calendar, CurrentState, ActionType } from '../classes/my-classes';
import { CalendarService } from './calendar-service.service';
import 'rxjs/add/observable/throw';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs-compat/operator/map';
import { ICalendar } from '../classes/my-interface';

@Injectable()
export class SharingService {

  Login: string;
  Pwd: string;
  public urlAddr = 'http://resys.pharaoh.cz/api';//'http://localhost:59630/api'; //'http://resys.pharaoh.cz/api'; //'/api'; //'https://192.168.2.221:82/api'; 'http://resys/api'

  public CurrentCalendar: Calendar;
  public SelectedObject: Object;
  public SelectedId: string;
  public CurrentState: CurrentState;
  public PreviousCalendar: Calendar;

  public ccal: Observable<Calendar>;

  constructor(private _http: HttpClient) {
    this.LoadDefaultCalendar();
  }

  public setObject(obj: Object) {
    this.SelectedObject = obj;
    // this.onChange.trigger(tag);
  }
  getTag<Object>() {
    return this.SelectedObject;
  }

  handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().catch || 'chyba');
  }



  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa(this.Login + ':' + this.Pwd));
  }
  getHeaders(headers: HttpHeaders) {
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // headers.append('Content-type', 'application/json');
  }

  createNewHeader() {
    return new HttpHeaders();
  }

  getAddress(adr: string) {
    return this.urlAddr + '/' + adr;
  }

  createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // this.createAuthorizationHeader(headers);

    return headers;
  }

  getCurrentState(actDate: Date = null, type: ActionType = ActionType.GetEvents) {
    if (this.CurrentState == null) {
      this.CurrentState = new CurrentState();
      this.CurrentState.calendarId = this.CurrentCalendar.id;
      if (actDate == null && (this.CurrentState.dateFrom == null || this.CurrentState.dateTo == null)) {
        this.setStartAdnEndDate(actDate);
      }
    }

    this.CurrentState.type = type;

    return this.CurrentState;
  }

  getCurrentStateJson(actDate: Date = null, type: ActionType = ActionType.GetEvents) {
    return JSON.stringify(this.getCurrentState(actDate, type));
  }

  setStartAdnEndDate(actDate: Date) {
    if (actDate == null) {
      actDate = new Date();
    }
    this.CurrentState.dateFrom = new Date(actDate);
    this.CurrentState.dateFrom.setDate(actDate.getDate() - 7);
    this.CurrentState.dateTo = new Date(actDate);
    this.CurrentState.dateTo.setDate(actDate.getDate() + 7);
  }

  LoadDefaultCalendar() {
    this.getCalendar(1).subscribe(
      data => {
        this.CurrentCalendar = data;
      },
      error => { },
      () => console.log('getCalendar Completed!')
    );
  }

  // getCalendar(objId: number) {
  //   let addr = this.getAddress("Calendar/" + objId);
  //   return this._http.get<Calendar>(addr)
  //   .pipe(
  //     catchError(err => new function() { this.handleError(err); })
  //   )
  // }

  // getCalendar (objId: number) {
  //   let addr = this.getAddress("Calendar/" + objId);
  //   return this._http.get<Calendar>(addr)
  //     .pipe(
  //       catchError(err => new function() { this.handleError(err); })
  //     );
  // }

  getCalendar(objId: number): Observable<ICalendar> {
    let addr = this.getAddress("Calendar/" + objId);
    return this._http.get<ICalendar>(addr).pipe();
  }

  // getHeroes (): Observable<Hero[]> {
  //   return this.http.get<Hero[]>(this.heroesUrl)
  //     .pipe(
  // catchError(this.handleError('getHeroes', []))
  //     );
  // }

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
