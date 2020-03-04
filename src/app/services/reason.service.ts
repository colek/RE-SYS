import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Reason } from '../classes/my-classes';
import { SharingService } from './sharing-service.service';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IReason } from '../classes/my-interface';

@Injectable()
export class ReasonService {
  servicePrefix: string = 'Reasons';
  constructor(private _http: HttpClient, private _sharingService: SharingService) { }


  private getReasons(calId: number): Promise<Reason[]> {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + calId);

    let headers = this._sharingService.createHeaders();
    return this._http.get<Reason[]>(addr)
      .toPromise();
  }

  // TODO to all methods
  public async GetReasons(): Promise<Reason[]> {
    let reasons = await this.getReasons(this._sharingService.CurrentCalendar.id)
      .catch((ex) => {
        console.error("GetReasons Error: " + ex);
        return null;
      });

    return reasons;
  }

  AddReason(obj: Reason) {
    let headers = this._sharingService.createHeaders();
    let jsoned = JSON.stringify(obj);
    return this._http.post(this._sharingService.getAddress(this.servicePrefix),
      jsoned, {
      headers: headers
    })
      .toPromise();
  }

  EditReason(obj: Reason) {
    let strAddr = this._sharingService.getAddress(this.servicePrefix + '/' + obj.id);
    let headers = this._sharingService.createHeaders();
    let jsoned = JSON.stringify(obj);
    return this._http.put(strAddr, jsoned, {
      headers: headers
    })
      .toPromise();
  }

  //---------------------DELETE 

  DeleteReason(id: number) {
    let objAddr = this._sharingService.getAddress(this.servicePrefix + '/' + id);
    let headers = this._sharingService.createHeaders();

    return this._http.delete(objAddr, {
      headers: headers
    })
      .toPromise();
  }
}
