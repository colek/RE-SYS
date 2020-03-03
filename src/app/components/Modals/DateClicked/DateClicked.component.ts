import { Component, OnInit } from "@angular/core";
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'DateClicked',
    templateUrl: './DateClicked.component.html',
    styleUrls: ['./DateClicked.component.css']
})
export class DateClicked implements OnInit {

    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {

    }

    ngOnInit(): void {
        //throw new Error("Method not implemented.");
    }

}