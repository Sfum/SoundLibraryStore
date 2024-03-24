import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {map, Observable} from "rxjs";
import firebase from "firebase/compat";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {
    // @ts-ignore
    this.user$ = afAuth.authState;
  }

  user$: Observable<firebase.User>;

  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.afAuth.signOut();
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      // Perform logic to determine if user is an admin
      map(user => user && user.email === 'pulsedrecords@gmail.com')
    );
  }
}
