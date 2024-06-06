import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { WishlistService } from './wishlist.service';
import { CartService } from './cart.service';
import User = firebase.User;
import { SnackbarService } from './snackbar.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private wishlistService: WishlistService,
    private cartService: CartService,
    public snackbarService: SnackbarService,
  ) {
    this.user$ = afAuth.authState as Observable<User | null>;
  }

  user$: Observable<User | null> = this.afAuth
    .authState as Observable<User | null>;

  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.snackbarService.showSnackbar(`Welcome, you have been logged in!`);
      })
      .catch((error) => {
        this.snackbarService.showSnackbar(`Sign In failed: ${error.message}`);
      });
  }

  signUp(
    email: string,
    password: string,
    displayName: string,
    photoURL: string,
    address: string,
    postcode: string,
    country: string,
    isContentProvider: boolean,
    brand_name: string,
    brand_description: string,
  ) {
    return new Promise<void>((resolve, reject) => {
      this.afAuth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          if (!user) {
            throw new Error('User not found after creation');
          }

          return user
            .updateProfile({
              displayName: displayName,
              photoURL: photoURL,
            })
            .then(() => user); // Ensure user is returned for the next then() block
        })
        // @ts-ignore

        .then((user) => {
          let userData: any = {
            displayName: displayName,
            photoURL: photoURL,
            address: address,
            postcode: postcode,
            country: country,
            role: 'user',
          };

          if (isContentProvider) {
            const randomId = this.generateRandomId(); // Generating random 6-digit number

            const brandData = {
              id: randomId, // Generating random 6-digit number
              brand_name: brand_name,
              brand_description: brand_description,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              moderators: [user.uid], // Add the user UID as a moderator
            };

            return this.firestore
              .collection('brands')
              .add(brandData)
              .then((ref) => {
                userData = {
                  ...userData,
                  role: 'brand',
                  brandId: ref.id,
                  brand_name: brand_name,
                  brand_description: brand_description,
                };

                return Promise.all([
                  this.firestore
                    .collection('users')
                    .doc(user.uid)
                    .set(userData),
                  this.firestore
                    .collection('brands')
                    .doc(ref.id)
                    .update({ _id: ref.id, id: randomId }),
                ]);
              });
          } else {
            return this.firestore
              .collection('users')
              .doc(user.uid) // Use user.uid to save under the user's UID
              .set(userData);
          }
        })
        .then(() => {
          resolve();
          this.snackbarService.showSnackbar('User signed up successfully!');
        })
        .catch((error) => {
          reject(error);
          this.snackbarService.showSnackbar(`Sign Up failed: ${error.message}`);
        });
    });
  }

  generateRandomId(): number {
    // Generate a random 6-digit number
    return Math.floor(100000 + Math.random() * 900000);
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
      map((user) => user && user.email === 'pulsedrecords@gmail.com'),
    );
  }

  isModerator(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (!user) {
          return of(false); // No user logged in, so not a moderator
        } else {
          return this.afAuth.idTokenResult.pipe(
            switchMap((idTokenResult) => {
              if (idTokenResult?.claims?.['moderator']) {
                return of(true); // User has moderator claim
              } else {
                return of(false); // User does not have moderator claim
              }
            }),
          );
        }
      }),
    );
  }
}
