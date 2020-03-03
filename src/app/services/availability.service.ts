import { Injectable, Pipe } from '@angular/core';
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


  async GetAvailabilities(calId: number): Promise<IAvailability[]> {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + calId + '/standard');

    return this._http.get<IAvailability[]>(addr).toPromise();
  }

  async GetAltAvailabilities(calId: number): Promise<IAvailability[]> {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + calId + '/alt');

    return this._http.get<Availability[]>(addr).toPromise();
  }

  AddAvailability(obj: Availability): Promise<any> {
    let headers = this._sharingService.createHeaders();
    let jsoned = JSON.stringify(obj);
    return this._http.post<any>(this._sharingService.getAddress(this.servicePrefix),
      jsoned, {
      headers: headers
    })
      .toPromise();
  }

  EditAvailability(obj: Availability): Promise<any> {
    let strAddr = this._sharingService.getAddress(this.servicePrefix + '/' + obj.id);
    let headers = this._sharingService.createHeaders();
    let jsoned = JSON.stringify(obj);
    return this._http.put<any>(strAddr, jsoned, {
      headers: headers
    }).toPromise();
  }

  //---------------------DELETE 

  DeleteAvailability(id: number): Promise<any> {
    let objAddr = this._sharingService.getAddress(this.servicePrefix + '/' + id);
    let headers = this._sharingService.createHeaders();

    return this._http.delete(objAddr, {
      headers: headers
    }).toPromise();
  }



}
