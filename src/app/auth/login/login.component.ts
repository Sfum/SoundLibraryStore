import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    public router: Router,
  ) {}

  onSubmit() {
    this.authService
      .signIn(this.email, this.password)
      .then(() => {
        console.log('User logged in successfully');
        this.router.navigate(['/']);
      })
      .catch((error: { message: any }) => {
        console.error('Error logging in:', error.message);
      });
  }
}
