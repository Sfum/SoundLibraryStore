import {Component, OnInit} from '@angular/core';
import {Format} from "../../models/format";
import {FormatService} from "../../services/format.service";
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-logo-bar',
  templateUrl: './logo-bar.component.html',
  styleUrl: './logo-bar.component.sass'
})
export class LogoBarComponent implements OnInit {
  formats: Format[] = [];

  user$: Observable<firebase.User> | undefined;
  // @ts-ignore
  isAdmin: Observable<boolean> = false;

  constructor(private formatService: FormatService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.formatService.getFormats().subscribe(formats => {
      this.formats = formats;
      // @ts-ignore
      this.user$ = this.authService.user$;
      this.isAdmin = this.authService.isAdmin()
    });
  }
}
