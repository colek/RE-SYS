import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Reasons } from '../classes/my-classes';
import { SharingService } from './sharing-service.service';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IReasons } from '../classes/my-interface';

@Injectable()
export class ReasonService {
  servicePrefix: string = 'Reasons';
  constructor(private _http: HttpClient, private _sharingService: SharingService) { }


  GetReasons(calId: number): Promise<Reasons[]> {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + calId);

    let headers = this._sharingService.createHeaders();
    return this._http.get<Reasons[]>(addr)
      .toPromise();
  }

  AddReason(obj: Reasons) {
    let headers = this._sharingService.createHeaders();
    let jsoned = JSON.stringify(obj);
    return this._http.post(this._sharingService.getAddress(this.servicePrefix),
      jsoned, {
      headers: headers
    })
      .toPromise();
  }

  EditReason(obj: Reasons) {
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
