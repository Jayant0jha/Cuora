import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AuthServiceService } from '../auth-service.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { EventServiceService } from '../event-service.service';

@Component({
  selector: 'app-eventscard',
  templateUrl: './eventscard.component.html',
  styleUrls: ['./eventscard.component.scss']
})
export class EventscardComponent implements OnInit {
  @Input('member') e;

  currUserId;
  currUserName;
  isformvisible = false;
  eventsFromDb;
  yesClicked;
  noClicked;
  eventsAttending = Array<string>();
  eventsNotAttending = Array<string>();
  public addEventFormGroup: FormGroup


  editedEvent = {Title: "", Desc: "", Venue: "", Date: null, Yes: [], No: [], CreatedBy: "", CreatedById: ""}
  
  constructor(public db: AngularFirestore, public auth: AuthServiceService, public _snackbar: MatSnackBar, public eventService: EventServiceService) { }

  ngOnInit(): void {
    this.getCurrentUserName()
    this.getEvents()
  }

  
  getEvents(){
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
            this.yesClicked = true
            this.eventsAttending.push(element.id)
          }
          else{
            this.yesClicked = false
          }
        });
      });

      this.eventsFromDb.forEach(element => {
        element.No.forEach(ids => {
          if(ids==this.currUserId){
            this.noClicked = true
            this.eventsNotAttending.push(element.id)
          }
          else{
            this.noClicked = false
          }
        });
      });
      

      //this.eventsFromDb.sort((a, b) => a.Date.localeCompare(b.Date))
    })
  }

  getCurrentUserName(){
    this.currUserId = this.auth.getUserId()
    this.db.collection('Users', ref=>ref
    .where('UserId', '==', this.currUserId))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
    .subscribe(res=>{
      this.currUserName = res[0].Name
    })
  }


  deleteEvent(e){
    console.log(e)
    this.db.collection("Events").doc(e.id).delete()
    //show snackbar
    let snackBarRef = this._snackbar.open("Event deleted successfully!")
    setTimeout(snackBarRef.dismiss.bind(snackBarRef), 2000);
    
  }

  editEvent(e){
    this.isformvisible = true
    this.addEventFormGroup = new FormGroup({
      eventTitle : new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      eventDesc: new FormControl('', [Validators.required]),
      eventVenue: new FormControl('', [Validators.required]),
      eventDate: new FormControl('', [Validators.required])
    });
    this.editedEvent = {...this.e};

    this.editedEvent.Date = this.editedEvent.Date.toDate();
    console.log("editedddd", this.editedEvent)
    console.log("edit button clicked")
    console.log(e)
    
  }

  updateEvent(){
    if (this.addEventFormGroup.valid) {
      this.editedEvent.Date = this.editedEvent.Date.toDate()
      this.db.collection("Events").doc(this.e.id).set(this.editedEvent)
      this.isformvisible = !this.isformvisible
      //show snackbar
      let snackBarRef = this._snackbar.open("Event updated successfully!")
      setTimeout(snackBarRef.dismiss.bind(snackBarRef), 2000);
    } else {
    let snackBarRef = this._snackbar.open("Please fill all the required fields!")
    setTimeout(snackBarRef.dismiss.bind(snackBarRef), 2000);

    }
    
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.addEventFormGroup.controls[controlName].hasError(errorName);
  }

  cancelUpdate(){
    this.isformvisible = !this.isformvisible
  }

  yesBtnClicked(e){
    // this.yesClicked = !this.yesClicked
    // if(this.yesClicked){
    //   e.Yes.push(this.currUserId)
    //   this.db.collection("Events").doc(e.id).set(e)
    // }
    // else if(!this.yesClicked){
    //   const index: number = e.Yes.indexOf(this.currUserId)
    //   e.Yes.splice(index, 1)
    //   this.db.collection("Events").doc(e.id).set(e)
    // }
    this.yesClicked = !this.yesClicked
    if(!this.eventsAttending.includes(e.id)){
      this.noClicked = !this.yesClicked
      const index: number = e.No.indexOf(this.currUserId)
      if(index!=-1)
        e.No.splice(index, 1)
      e.Yes.push(this.currUserId)
    }
    else {
      const index: number = e.Yes.indexOf(this.currUserId)
      e.Yes.splice(index, 1)
    }
    this.db.collection("Events").doc(e.id).set(e)    
  }

  noBtnClicked(e){
    this.noClicked = !this.noClicked
    if(!this.eventsNotAttending.includes(e.id)){
      this.yesClicked = !this.noClicked
      const index: number = e.Yes.indexOf(this.currUserId)
      if(index!=-1)
        e.Yes.splice(index, 1)
      e.No.push(this.currUserId)
    }
    else {
      const index: number = e.No.indexOf(this.currUserId)
      e.No.splice(index, 1)
    }
    this.db.collection("Events").doc(e.id).set(e)  
    
  }

}
