
import { NgModule } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FieldsetModule } from 'primeng/fieldset';
import { AccordionModule } from 'primeng/accordion';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'primeng/tree';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
    exports: [
        // DataViewModule,
        InputTextModule,
        DropdownModule,
        CalendarModule,
        // MultiSelectModule,
        // KeyFilterModule,
        // MessageModule,
        // MessagesModule,
        // InputMaskModule,
        RadioButtonModule,
        // FieldsetModule,
        // AccordionModule,
        // SplitButtonModule,
        ButtonModule,
        // MenuModule,
        // InputSwitchModule,
        CheckboxModule,
        // TableModule,
        // SliderModule,
        DialogModule,
        // TreeModule,
        // TabViewModule,
        // PanelModule,
        FullCalendarModule,
        DynamicDialogModule,
        ProgressSpinnerModule
    ]
})
export class PrimeNGModule { }

