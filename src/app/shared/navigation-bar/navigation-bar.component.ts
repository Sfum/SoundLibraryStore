import { Component } from '@angular/core';
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.sass'
})
export class NavigationBarComponent {

  user$: Observable<firebase.User> | undefined;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.user$ = this.authService.user$;
  }

}
