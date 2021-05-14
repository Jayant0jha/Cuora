import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import { AuthServiceService } from './auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public auth: AuthServiceService, public router: Router) { }

  // async canActivate() : Promise<boolean>{
  //   if(await this.auth.isUserSignedIn()){
  //     return true
  //   }
  //   else{
  //     this.router.navigateByUrl("\signin")
  //     return false
  //   }
  // }

   canActivate(): Observable<boolean> {
    if (! ( this.auth.isUserSignedIn())) {
      this.router.navigate(['signin']);
      return of(false)
    }
    return of(true);
  }
}
