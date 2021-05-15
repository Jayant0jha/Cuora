import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  public addEventFormGroup: FormGroup
  eventObj: {Title: string, Desc: string, Venue: string, Date: any, Yes: Array<string>, No: Array<string>, CreatedBy: string, CreatedById: string} = {Title: "", Desc: "", Venue: "", Date: null, Yes: [], No: [], CreatedBy: "", CreatedById: ""}
  eventsFromDb = []
  currUserId;
  currUserName;
  eventsCollRef;
  eventHead = "Events"
  todaysDate;
  isLoading = false;

  constructor(private _ngZone: NgZone, public db: AngularFirestore, public auth: AuthServiceService, private _snackbar: MatSnackBar, private matdialog: MatDialog) { }
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  
  ngOnInit(): void {
    this.todaysDate = new Date()
    this.getCurrentUserName()
    this.getEvents()
    this.addEventFormGroup = new FormGroup({
      eventTitle : new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]),
      eventDesc: new FormControl('', [Validators.required]),
      eventVenue: new FormControl('', [Validators.required]),
      eventDate: new FormControl('', [Validators.required])
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.addEventFormGroup.controls[controlName].hasError(errorName);
  }

  createEvent(){
    if(this.addEventFormGroup.valid) {
      this.eventObj.CreatedBy = this.currUserName
      this.eventObj.CreatedById = this.currUserId
  
      //convert timestamp to date
      // var myDate = moment(this.eventObj.Date).format('DD/MM/YYYY');
      // this.eventObj.Date = myDate
      console.log(this.eventObj.Date)
      this.eventObj.Date = this.eventObj.Date.toDate()
      console.log(this.eventObj)
      this.db.collection("Events").add(this.eventObj)
      //show snackbar
      let snackBarRef = this._snackbar.open("Event added successfully!")
      setTimeout(snackBarRef.dismiss.bind(snackBarRef), 2000);
  
      //clear form
      this.formGroupDirective.resetForm()
    } else {
      let snackBarRef = this._snackbar.open("Please fill all the required fields!")
      setTimeout(snackBarRef.dismiss.bind(snackBarRef), 2000);

    }
  }

  getEvents(){
    this.isLoading = true;
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
      this.isLoading = false;
      this.eventsFromDb = res
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


}
