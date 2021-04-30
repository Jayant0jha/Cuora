import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email=""
  password=""

  constructor(public auth: AuthServiceService, public route: Router) { }

  ngOnInit() {
  }
  
  SignUp(){
    let status = false
    this.auth.signUpAuth(this.email, this.password)
  }

}
