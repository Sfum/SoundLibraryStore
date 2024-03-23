import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,
              public dialogRef: MatDialogRef<LoginComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public router: Router) { }

  onSubmit() {
    this.authService.signIn(this.email, this.password)
      .then(() => {
        console.log('User logged in successfully');
        this.dialogRef.close();
        this.router.navigate(['/']);
      })
      .catch((error: { message: any; }) => {
        console.error('Error logging in:', error.message);
      });
  }
}
