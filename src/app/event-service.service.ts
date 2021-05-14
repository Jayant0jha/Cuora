import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AuthServiceService } from './auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class EventServiceService {
  eventsFromDb;
  currUserId;
  eventsAttending = [];
  eventsNotAttending = [];
  constructor(public db: AngularFirestore, public auth:AuthServiceService) { }

  getEventsAttending(){
    this.currUserId = this.auth.getUserId()
    this.db
    .collection("Events",  ref=>ref.orderBy('Date'))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
    .subscribe(res=>{
      this.eventsFromDb = res
      this.eventsFromDb.forEach(element => {
        element.Yes.forEach(ids => {
          if(ids==this.currUserId){
            this.eventsAttending.push(element.id)
          }
        });
      });
      
    })
    return this.eventsAttending
  }

  getEventsNotAttending(){
    this.currUserId = this.auth.getUserId()
    this.db
    .collection("Events",  ref=>ref.orderBy('Date'))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
    .subscribe(res=>{
      this.eventsFromDb = res
      this.eventsFromDb.forEach(element => {
        element.No.forEach(ids => {
          if(ids==this.currUserId){
            this.eventsNotAttending.push(element.id)
          }
        });
      });
      
    })
    return this.eventsNotAttending
  }

}
