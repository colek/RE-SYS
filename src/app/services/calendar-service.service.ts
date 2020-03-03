import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Calendar, ServerEvent } from '../classes/my-classes';
import { SharingService } from './sharing-service.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { IService, ICalendar } from '../classes/my-interface';
// import 'rxjs/add/operator/toPromise';

@Injectable()
export class CalendarService implements IService {
  servicePrefix: string = 'Calendar';

  constructor(private _http: HttpClient, private _sharingService: SharingService) {

  }


  // // wrong test with promise async
  // getCalendar<Calendar>(objId: number) {
  //   let addr = this._sharingService.getAddress(this.servicePrefix + "/" + objId);
  //   let res: Calendar;
  //   this._http.get(addr)
  //     .toPromise()
  //     .then(
  //       data => {
  //         res => data.json();

  //         console.log('Promise resolved.')
  //       }
  //     )
  //     .catch(this._sharingService.handleError)

  // }

  // getCalendars() {
  //   let addr = this._sharingService.getAddress(this.servicePrefix);
  //   return this._http.get(addr)
  //     .pipe(
  //       map((res: Response) => res.json()),
  //       catchError(this._sharingService.handleError)
  //     )
  // }

  async GetCalendar(objId: number): Promise<ICalendar> {
    let addr = this._sharingService.getAddress(this.servicePrefix + "/" + objId);
    return this._http.get<ICalendar>(addr).toPromise();

  }

  // getDefaultCalendar() {
  //   let addr = this._sharingService.getAddress(this.servicePrefix + "/");
  //   return this._http.get(addr)
  //     .pipe(
  //       map((res: Response) => res.json()),
  //       catchError(this._sharingService.handleError)
  //     )
  // }
  // //-----------------


  // addCalendar(obj: Calendar) {
  //   let headers = this._sharingService.createHeaders();
  //   let strDevice = JSON.stringify(obj);
  //   return this._http.post(this._sharingService.getAddress(this.servicePrefix), strDevice, {
  //     headers: headers
  //   })
  //     .pipe(
  //       map((res: Response) => res.json()),
  //       catchError(this._sharingService.handleError)
  //     )
  // }
  // //--------------------



  // editCalendar(obj: Calendar) {
  //   let strAddr = this._sharingService.getAddress(this.servicePrefix +"/"+ obj.Id);
  //   let headers = this._sharingService.createHeaders();
  //   let strObj = JSON.stringify(obj);
  //   return this._http.put(strAddr, strObj, {
  //     headers: headers
  //   })
  //     .pipe(
  //       map((res: Response) => console.log(JSON.stringify(res))),
  //       catchError(this._sharingService.handleError)
  //     )
  // }


  // editEvent(obj: ServerEvent) {
  //   let strAddr = this._sharingService.getAddress(this.servicePrefix + 'Event/' + obj.Id);
  //   let headers = this._sharingService.createHeaders();
  //   let strObj = JSON.stringify(obj);
  //   return this._http.put(strAddr, strObj, {
  //     headers: headers
  //   })
  //     .pipe(
  //       map((res: Response) => console.log(JSON.stringify(res))),
  //       catchError(this._sharingService.handleError)
  //     )
  // }

  // //---------------------DELETE 

  // deleteCalendar(obj: Calendar){
  //   let objAddr = this._sharingService.getAddress(this.servicePrefix + '/' + obj.Id);
  //   let headers = this._sharingService.createHeaders();
  //   return this._http.delete(objAddr, {
  //     headers: headers
  //   })
  //     .pipe(
  //       map((res: Response) => console.log(JSON.stringify(res))),
  //       catchError(this._sharingService.handleError)
  //     )
  // }
}
