import { Injectable } from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import { AuthServiceService } from './auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public auth: AuthServiceService, public router: Router) { }

  canActivate() : boolean{
    if(this.auth.isUserSignedIn()){
      return true
    }
    else{
      this.router.navigateByUrl("\signin")
      return false
    }
  }
}
