import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth:AuthServiceService) { }
  isLoggedIn;

  ngOnInit(): void {
  }
  
  LogOut(){
    this.auth.LogoutAuth()
  }

}
