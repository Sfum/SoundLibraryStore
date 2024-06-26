import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Okay!', {
      duration: 3000,
      panelClass: ['custom-snackbar'],
    });
  }
}
