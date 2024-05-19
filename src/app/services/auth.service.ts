import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map, Observable, of, switchMap} from "rxjs";
import firebase from "firebase/compat";
import {Router} from "@angular/router";
import {WishlistService} from "./wishlist.service";
import {CartService} from "./cart.service";
import User = firebase.User;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private firestore: AngularFirestore,
              private router: Router,
              private wishlistService: WishlistService,
              private cartService: CartService) {

    this.user$ = afAuth.authState as Observable<User | null>;
  }

  user$: Observable<User | null> = this.afAuth.authState as Observable<User | null>;


  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signUp(email: string, password: string, displayName: string, photoURL: string,
         address: string, postcode: string, country: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // User created successfully
        const user = userCredential.user;

        if (user) {
          return user.updateProfile({
            displayName: displayName,
            photoURL: photoURL,

          }).then(() => {
            // Add additional information to Firestore
            return this.firestore.collection('users').doc(user.uid).set({
              displayName: displayName,
              photoURL: photoURL,
              address: address,
              postcode: postcode,
              country: country,
            });
          });
        } else {
          throw new Error("User not found after creation");
        }
      });
  }

  async signOut() {
    this.wishlistService.clearWishlist();
    this.cartService.clearCart();
    await this.afAuth.signOut();
    window.location.reload();
  }

  isAdmin(): Observable<boolean> {
    // @ts-ignore
    return this.user$.pipe(
      map(user => user && user.email === 'pulsedrecords@gmail.com')
    );
  }
}
