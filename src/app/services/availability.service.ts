import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { IService, Availability } from '../classes/my-classes';
import { SharingService } from './sharing-service.service';
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class AvailabilityService {

  servicePrefix: string = 'Availabilities';
  constructor(private _http: Http, private _sharingService: SharingService) { }


  getAvailabilities(calId: number) {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + calId + '/standard');

    let headers = this._sharingService.createHeaders();
    return this._http.get(addr)
      .pipe(
        map((res: Response) => res.json()),
        catchError(this._sharingService.handleError)
      )
  }

  getAltAvailabilities(calId: number) {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + calId + '/alt');

    let headers = this._sharingService.createHeaders();
    return this._http.get(addr)
      .pipe(
        map((res: Response) => res.json()),
        catchError(this._sharingService.handleError)
      )
  }

  addAvailability(obj: Availability) {
    let headers = this._sharingService.createHeaders();
    let jsoned = JSON.stringify(obj);
    return this._http.post(this._sharingService.getAddress(this.servicePrefix),
      jsoned, {
        headers: headers
      })
      .pipe(
        map((res: Response) => res.json()),
        catchError(this._sharingService.handleError)
      )
  }

  editAvailability(obj: Availability) {
    let strAddr = this._sharingService.getAddress(this.servicePrefix + '/' + obj.id);
    let headers = this._sharingService.createHeaders();
    let jsoned = JSON.stringify(obj);
    return this._http.put(strAddr, jsoned, {
      headers: headers
    })
      .pipe(
        map((res: Response) => console.log(JSON.stringify(res))),
        catchError(this._sharingService.handleError)
      )
  }

  //---------------------DELETE 

  deleteAvailability(id: number) {
    let objAddr = this._sharingService.getAddress(this.servicePrefix + '/' + id);
    let headers = this._sharingService.createHeaders();

    return this._http.delete(objAddr, {
      headers: headers
    })
      .pipe(
        map((res: Response) => console.log(JSON.stringify(res))),
        catchError(this._sharingService.handleError)
      )
  }



}
