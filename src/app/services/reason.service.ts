import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { IService, Reasons } from '../classes/my-classes';
import { SharingService } from './sharing-service.service';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ReasonService {
  servicePrefix: string = 'Reasons';
  constructor(private _http: Http, private _sharingService: SharingService) { }


  getReasons(calId: number) {
    let addr = this._sharingService.getAddress(this.servicePrefix +
      '/' + calId);

    let headers = this._sharingService.createHeaders();
    return this._http.get(addr)
      .pipe(
        map((res: Response) => res.json()),
        catchError(this._sharingService.handleError)
      )
  }

  // getReason(objId: string) {
  //   let addr = this._sharingService.getAddress(this.servicePrefix +
  //     '/' + objId);

  //   let headers = this._sharingService.createHeaders();
  //   this._sharingService.currentState.event = new ServerEvent();
  //   this._sharingService.currentState.event.id = objId;
  //   return this._http.post(addr, this._sharingService.getCurrentStateJson(null, ActionType.AddEvent), {
  //     headers: headers
  //   })
  //     .pipe(
  //       map((res: Response) => res.json()),
  //       catchError(this._sharingService.handleError)
  //     )
  // }

  // -----------------

  addReason(obj: Reasons) {
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




  editReason(obj: Reasons) {
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

  deleteReason(id: number) {
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
