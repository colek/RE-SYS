import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CalendarSettingsComponent } from './components/calendar-settings/calendar-settings.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MyCalendarComponent } from './mycalendar/mycalendar.component';


const appRoutes: Routes = [
    { path: 'settings', component: CalendarSettingsComponent },
    { path: 'mycalendar', component: MyCalendarComponent },
    //   { path: 'newfolder/:parentId', component: NewfolderComponent },
    //   { path: 'newfolder', component: NewfolderComponent },
    //   { path: 'editfolder/:id', component: NewfolderComponent },
    //   { path: 'editexpression/:parentId/:id', component: ExpressionComponent },
    //   { path: 'edittagfromfolder/:parentFolderId/:id', component: TagComponent },
    //   { path: 'edittagfromdevice/:parentDeviceId/:id', component: TagComponent },
    //   { path: 'newtag/:parentDeviceId', component: TagComponent },
    //   { path: 'device/:id', component: DeviceDetailComponent },
    //   { path: 'newdevice', component: DeviceDetailComponent },
    //   { path: 'newexpression/:parentId', component: ExpressionComponent },
    //   { path: 'dataitems', component: DevicesComponent },
    //   { path: 'modbus', component: RegistersComponent },
    //   { path: 'login', component: AuthComponent },
    //   { path: 'logs', component: LogListComponent },
    //   { path: 'log/:id', component: LogDayComponent },
    { path: '', redirectTo: '/mycalendar', pathMatch: 'full' },
    { path: '*.html', redirectTo: '/mycalendar', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }