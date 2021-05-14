import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Dept{
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email = ""
  password = ""
  hide = true;
  userId;
  user: {UserId: any, Name: string, Enrol_year: number, Department: string} = {UserId: null, Name:"", Enrol_year: null, Department:""}
  

  dep: Dept[] = [
    {value: 'Agriculture', viewValue: 'Agriculture'},
    {value: 'Computer Science', viewValue: 'Computer Science'},
    {value: 'Civil', viewValue: 'Civil'},
    {value: 'Electrical', viewValue: 'Electrical'},
    {value: 'Electronics and Communication', viewValue: 'Electronics and Communication'},
    {value: 'Information Technology', viewValue: 'Information Technology'},
    {value: 'Mechanical', viewValue: 'Mechanical'},
    {value: 'Mining', viewValue: 'Mining'}

  ];

  constructor(public auth: AuthServiceService, public route: Router, public db: AngularFirestore, private _snackbar: MatSnackBar) { }

  ngOnInit() {
  }
  
  async SignUp(){
    let status = false
    this.user.UserId = await this.auth.signUpAuth(this.email, this.password)
    
    this.addUser()
    //show snackbar
    let snackBarRef = this._snackbar.open("Signup successful!")
    setTimeout(snackBarRef.dismiss.bind(snackBarRef), 2000);
  }

  addUser(){
    this.db.collection("Users").add(this.user);
    //console.log(this.user)
    this.user = {UserId: null, Name:"", Enrol_year:null, Department:""}
    this.email = this.password = ""
  }

}
