import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthServiceService } from 'src/app/auth-service.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth:AuthServiceService, public db: AngularFirestore) { 
  }
  isLoggedIn;

  ngOnInit(): void {
    
  }
  
  LogOut(){
    this.auth.LogoutAuth()
  }


}
