import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private _snackbar: MatSnackBar) { }

  displayToast(msg, duration=3000, action='') {
    this._snackbar.open(msg, action, {duration});
  }
}
