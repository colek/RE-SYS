import { Component, OnInit } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'CommonAlert',
    templateUrl: './CommonAlert.component.html',
    styleUrls: ['./CommonAlert.component.css']
})
export class CommonAlert implements OnInit {

    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {

    }

    ngOnInit(): void {
        // throw new Error("Method not implemented.");
    }

}