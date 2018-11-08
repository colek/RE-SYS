import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Availability } from '../classes/my-classes';
import { SharingService } from './sharing-service.service';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IAvailability } from '../classes/my-interface';


@Injectable()
export class AvailabilityService {

  servicePrefix: string = 'Availabilities';
  constructor(private _http: HttpClient, private _sharingService: SharingService) { }


  getAvailabilities(calId: number):Observable<IAvailability[]> {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + calId + '/standard');

    return this._http.get<Availability[]>(addr).pipe( );
  }

  getAltAvailabilities(calId: number):Observable<IAvailability[]> {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + calId + '/alt');

    return this._http.get< Availability[]>(addr).pipe( );
  }

  addAvailability(obj: Availability) {
    let headers = this._sharingService.createHeaders();
    let jsoned = JSON.stringify(obj);
    return this._http.post(this._sharingService.getAddress(this.servicePrefix),
      jsoned, {
        headers: headers
      })
      .pipe( );
  }

  editAvailability(obj: Availability) {
    let strAddr = this._sharingService.getAddress(this.servicePrefix + '/' + obj.id);
    let headers = this._sharingService.createHeaders();
    let jsoned = JSON.stringify(obj);
    return this._http.put(strAddr, jsoned, {
      headers: headers
    }).pipe( );
  }

  //---------------------DELETE 

  deleteAvailability(id: number) {
    let objAddr = this._sharingService.getAddress(this.servicePrefix + '/' + id);
    let headers = this._sharingService.createHeaders();

    return this._http.delete(objAddr, {
      headers: headers
    }).pipe( );
  }



}
