import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  
  email=""
  password=""
  hide = true;
  
  constructor(public auth: AuthServiceService, public route: Router) { }

  ngOnInit() {
  }

  SignIn(){
    let status = false
    status = this.auth.signInAuth(this.email, this.password)
    if(status==true){
      this.route.navigateByUrl('/signup')
    }
  }

}
