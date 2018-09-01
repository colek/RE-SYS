import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { MyCalendarComponent } from './mycalendar/mycalendar.component';
import { FullCalendarModule } from 'ng-fullcalendar';
import { InitUserComponent } from './components/init-user/init-user.component';
import { InitCalendarComponent } from './components/init-calendar/init-calendar.component';
import { InitPageComponent } from './components/init-page/init-page.component';
import { SharingService } from './services/sharing-service.service';
import { CalendarService } from './services/calendar-service.service';
import { EventService } from './services/event.service';
import { ReasonService } from './services/reason.service';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';
import { Http, HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarSettingsComponent } from './components/calendar-settings/calendar-settings.component';
import { CalendarCommondaysComponent } from './components/calendar-commondays/calendar-commondays.component';
import { CalendarExtradaysComponent } from './components/calendar-extradays/calendar-extradays.component';
import { AvailabilityService } from './services/availability.service';


@NgModule({
  declarations: [
    AppComponent,
    MyCalendarComponent,
    InitUserComponent,
    InitCalendarComponent,
    InitPageComponent,
    MenuComponent,
    LoginComponent,
    CalendarSettingsComponent,
    CalendarCommondaysComponent,
    CalendarExtradaysComponent
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [SharingService, CalendarService, EventService, ReasonService, AvailabilityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
