import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
})
export class SignupComponent implements OnInit {
  email: string = '';
  password: string = '';
  displayName: string = '';
  photoURL: string = '';
  address: string = '';
  postcode: string = '';
  country: string = '';
  isContentProvider: boolean = false;
  brand_name: string = '';
  brand_description: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.authService
      .signUp(
        this.email,
        this.password,
        this.displayName,
        this.photoURL,
        this.address,
        this.postcode,
        this.country,
        this.isContentProvider,
        this.brand_name,
        this.brand_description,
      )
      .then(() => {
        console.log('User signed up successfully');
      })
      .catch((error) => {
        console.error('Error signing up:', error.message);
      });
  }
}
