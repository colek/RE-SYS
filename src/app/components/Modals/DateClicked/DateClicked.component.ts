import { Component, OnInit } from "@angular/core";
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UserEvent, Reason } from "../../../classes/my-classes";
import { ReasonService } from "../../../services/reason.service";
import { SharingService } from "../../../services/sharing-service.service";
import { isNullOrUndefined } from "util";

@Component({
    selector: 'DateClicked',
    templateUrl: './DateClicked.component.html',
    styleUrls: ['./DateClicked.component.css']
})
export class DateClicked implements OnInit {

    UserEvent: UserEvent;
    Reasons: Reason[];

    constructor(public ref: DynamicDialogRef, private _reasonService: ReasonService, public _sharingService: SharingService) {
    }

    async ngOnInit() {
        await this.GetReasons();
    }

    EventConfim() {
        console.log("Event confirmed");
    }

    CloseDialog() {
        console.log("Date dialog closed");
        this.ref.close();
    }

    async GetReasons() {
        if (isNullOrUndefined(this._sharingService.Reasons)) {
            this._sharingService.Reasons = await this._reasonService.GetReasons();
        }
        this.Reasons = this._sharingService.Reasons;
    }




}