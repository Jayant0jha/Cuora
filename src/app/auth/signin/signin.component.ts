import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  
  email=""
  password=""
  hide = true;
  
  constructor(public auth: AuthServiceService, public route: Router, private _snackbar: MatSnackBar) { }

  ngOnInit() {
  }

  SignIn(){
    let status = false
    status = this.auth.signInAuth(this.email, this.password)
    //show snackbar
    let snackBarRef = this._snackbar.open("Login successful!")
    setTimeout(snackBarRef.dismiss.bind(snackBarRef), 2000);
    if(status==true){
      this.route.navigateByUrl('/signup')
    }
  }

}
