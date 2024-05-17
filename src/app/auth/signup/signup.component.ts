import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.sass'
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  displayName: string = '';
  photoURL: string = '';

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.signUp(this.email, this.password, this.displayName, this.photoURL)
      .then(() => {
        console.log('User signed up successfully');
      })
      .catch(error => {
        console.error('Error signing up:', error.message);
      });
  }
}
