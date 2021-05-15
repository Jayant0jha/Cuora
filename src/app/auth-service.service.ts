import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  isSignedIn = false;
  loggedInUserId
   // store the URL so we can redirect after logging in
   public redirectUrl: string;

  constructor(public router: Router, public afAuth: AngularFireAuth) {  
    
    this.afAuth.user.subscribe(res=>{
      if(res && res.uid){
        this.loggedInUserId = res.uid
        this.isSignedIn = true
        if (this.redirectUrl) {
          this.router.navigate([this.redirectUrl]);
          this.redirectUrl = null;
        }
      }
      else{
        this.isSignedIn = false
      }
    })
  }

  signInAuth(email, password){
    this.afAuth.signInWithEmailAndPassword(email, password).then(res=>{
      this.isSignedIn = true
      this.loggedInUserId  = res.user.uid
      this.router.navigateByUrl("/home")
    })

    .catch(res=>{
      alert("Invalid Email Id or Password")
      this.isSignedIn = false
      this.router.navigateByUrl("/signin")
    })

    .finally();{
      return this.isSignedIn
    }
  }

  LogoutAuth(){
    this.isSignedIn = false
    this.afAuth.signOut()
    location.reload()
    this.router.navigateByUrl("/signin")
  }

  isUserSignedIn(){
    return this.isSignedIn
  }

  signUpAuth(email, password){
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(res=>{
      this.isSignedIn = true
      this.loggedInUserId  = res.user.uid
      this.router.navigateByUrl("/home")
     //console.log(this.loggedInUserId)
      return this.loggedInUserId
    }).catch(err=>{
      alert(err)
    })
  }

  getUserId(){
    return this.loggedInUserId
  }
}
