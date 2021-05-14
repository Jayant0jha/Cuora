import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { EventServiceService } from '../event-service.service';
import { map } from 'rxjs/operators';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  currUserId;
  eventHead = "My Events";
  constructor(public eventServ: EventServiceService, public db: AngularFirestore, public auth: AuthServiceService, private _snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.getMyEvents()
  }

  getMyEvents(){
    this.currUserId = this.auth.getUserId()
    this.db
    .collection("Events",  ref=>ref.where('CreatedById', '==', this.currUserId))
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
      console.log(this.eventsFromDb)
    })
  }

}
