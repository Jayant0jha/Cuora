import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  public addEventFormGroup: FormGroup
  eventObj: {Title: string, Desc: string, Venue: string, Date: any, Yes: number, No: number, CreatedBy: string, CreatedById: string} = {Title: "", Desc: "", Venue: "", Date: null, Yes: 0, No: 0, CreatedBy: "", CreatedById: ""}
  eventsFromDb = []
  currUserId;
  currUserName;

  constructor(private _ngZone: NgZone, public db: AngularFirestore, public auth: AuthServiceService, private _snackbar: MatSnackBar, private matdialog: MatDialog) { }
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  
  ngOnInit(): void {
    this.getCurrentUserName()
    this.getEvents()
    this.addEventFormGroup = new FormGroup({
      eventTitle : new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      eventDesc: new FormControl('', [Validators.required]),
      eventVenue: new FormControl('', [Validators.required]),
      eventDate: new FormControl('', [Validators.required])
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.addEventFormGroup.controls[controlName].hasError(errorName);
  }

  createEvent(){
    this.eventObj.CreatedBy = this.currUserName
    this.eventObj.CreatedById = this.currUserId
    console.log(this.eventObj)
    this.db.collection("Events").add(this.eventObj)
    //show snackbar
    let snackBarRef = this._snackbar.open("Event added successfully!")
    setTimeout(snackBarRef.dismiss.bind(snackBarRef), 2000);

    //clear form
    this.addEventFormGroup.reset()
  }

  getEvents(){
    this.db.collection("Events")
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
