import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
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

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {


    let url: string = state.url;
    console.log("urllllllllll",url);

    if (this.auth.isSignedIn) { return true; }

    // Store the attempted URL for redirecting
    this.auth.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/signin']);
    return false;

    // if (! ( this.auth.isUserSignedIn())) {
    //   this.router.navigate(['signin']);
    //   return of(false)
    // }
    //  // Store the attempted URL for redirecting
    //  this.auth.redirectUrl = url;
    //  // Navigate to the login page with extras
    // this.router.navigate(['/login']);
    // return of(true);
  }
}
