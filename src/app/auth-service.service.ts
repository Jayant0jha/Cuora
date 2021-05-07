import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  isSignedIn = false;
  loggedInUserId

  constructor(public router: Router, public afAuth: AngularFireAuth) {  
    
    this.afAuth.user.subscribe(res=>{
      if(res.uid){
        this.loggedInUserId = res.uid
        this.isSignedIn = true
        this.router.navigateByUrl("/events")
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
