import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { EventServiceService } from '../event-service.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-myevents',
  templateUrl: './myevents.component.html',
  styleUrls: ['./myevents.component.scss']
})
export class MyeventsComponent implements OnInit {
  e;
  eventsAttending;
  eventsNotAttending;
  eventsFromDb;
  constructor(public eventServ: EventServiceService, public db: AngularFirestore) { }

  async ngOnInit(): Promise<void> {
    this.eventsAttending = await this.eventServ.getEventsAttending()
    this.eventsNotAttending = await this.eventServ.getEventsNotAttending()
    this.eventsAttending.forEach(element => {
      this.getEvents(element)
    });
  }

  getEvents(idAtt){
    this.db
    .collection("Events",  ref=>ref.where('id', '==', idAtt))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
    .subscribe(res=>{
      this.eventsFromDb = res;
    })
  }

}
