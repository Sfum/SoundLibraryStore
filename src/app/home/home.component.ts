import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {
  user$: Observable<firebase.User> | undefined;
  isAdmin: boolean | undefined;
  isModerator: boolean | undefined;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // @ts-ignore
    this.user$ = this.authService.user$;
    this.authService.isAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
    this.authService.isModerator().subscribe((isModerator) => {
      this.isModerator = isModerator;
    });
  }
}
