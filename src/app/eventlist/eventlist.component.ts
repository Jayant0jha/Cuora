import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventlist',
  templateUrl: './eventlist.component.html',
  styleUrls: ['./eventlist.component.scss']
})
export class EventlistComponent implements OnInit {
  @Input() eventsFromDb = [];
  @Input() eventHeading;

  constructor() { }

  ngOnInit(): void {
  }

}
