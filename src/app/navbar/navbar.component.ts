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

  currUserName;
  currUserId;
  constructor(public auth:AuthServiceService, public db: AngularFirestore) { 
  }
  isLoggedIn;

  ngOnInit(): void {
    // this.getCurrentUserName();
  }
  
  LogOut(){
    this.auth.LogoutAuth()
  }

  getCurrentUserName(){
    this.currUserId = this.auth.getUserId()
    console.log(this.currUserId)
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
      console.log(this.currUserName)
    })
  }

}
