import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AuthServiceService } from '../auth-service.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

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
  public addEventFormGroup: FormGroup
  editedEvent = {Title: "", Desc: "", Venue: "", Date: null, Yes: 0, No: 0, CreatedBy: "", CreatedById: ""}
  
  constructor(public db: AngularFirestore, public auth: AuthServiceService, public _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCurrentUserName()
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
    this.editedEvent = this.e
    console.log("edit button clicked")
    console.log(e)
    
  }

  updateEvent(){
    this.db.collection("Events").doc(this.e.id).set(this.editedEvent)
    this.isformvisible = !this.isformvisible
    //show snackbar
    let snackBarRef = this._snackbar.open("Event updated successfully!")
    setTimeout(snackBarRef.dismiss.bind(snackBarRef), 2000);
    
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.addEventFormGroup.controls[controlName].hasError(errorName);
  }

  cancelUpdate(){
    this.isformvisible = !this.isformvisible
  }



}
