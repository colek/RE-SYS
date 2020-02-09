import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'vetcal',
  templateUrl: './vetcal.component.html',
  styleUrls: ['./vetcal.component.css']
})
export class VetcalComponent implements OnInit {

  events: any;
  options: any;

  constructor() { }

  ngOnInit() {

    // this.options = {
    //   plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    //   defaultDate: '2020-02-01',
    //   defaultView: 'timeGridWeek',
    //   header: {
    //     left: 'prev,next',
    //     center: 'title',
    //     right: 'month, timeGridWeek, agendaDay'
    //   },
    //   locale: 'cs'
    // }


    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      firstDay: 1,
      allDaySlot: false,
      editable: false,
      height: "auto",
      contentHeight: "auto",
      eventLimit: false,
      defaultView: "timeGridWeek",
      locale: 'cs',
      header: {
        left: 'prev,next',
        center: ',title,',
        right: ''
      },
      // minTime: duration("07:00:00"),
      // maxTime: duration("19:00:00"),
      hiddenDays: [0],
      themeSystem: "standard",
      selectable: true,
      selectOverlap: false,
      nowIndicator: true,
      // slotLabelFormat: "HH:mm",
      // timeFormat: "HH:mm",
      // columnFormat: "dddd D. M",
      // titleFormat: "D.MMM.YYYY",
      businessHours: [{
        dow: [1, 2, 3, 4, 5],
        start: "08:00",
        end: "12:00"
      }, {
        dow: [1, 2, 3, 4, 5],
        start: "13:00",
        end: "18:00"
      },
      {
        dow: [6],
        start: "15:00",
        end: "16:00"
      }
      ],
    };
  }

}