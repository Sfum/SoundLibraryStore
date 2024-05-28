import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { WishlistService } from './wishlist.service';
import { CartService } from './cart.service';
import User = firebase.User;
import { SnackbarService } from './snackbar.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { ref } from '@angular/fire/storage';
import { user } from '@angular/fire/auth';

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

          return user.updateProfile({
            displayName: displayName,
            photoURL: photoURL,
          });
        })
        .then(() => {
          let userData: any = {
            displayName: displayName,
            photoURL: photoURL,
            address: address,
            postcode: postcode,
            country: country,
            role: 'user',
          };

          if (isContentProvider) {
            const brandData = {
              brand_name: brand_name,
              brand_description: brand_description,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };

            return this.firestore
              .collection('brands')
              .add(brandData)
              .then((ref) => {
                // @ts-ignore
                brandData['_id'] = ref.id;
                userData = {
                  ...userData,
                  role: 'brand',
                  brandId: ref.id,
                  brand_name: brand_name,
                  brand_description: brand_description,
                };

                return this.firestore
                  .collection('brands')
                  .doc(ref.id)
                  .update({ _id: ref.id })
                  .then(() => {
                    return this.firestore
                      .collection('users')
                      .doc(ref.id)
                      .set(userData);
                  });
              });
          } else {
            return this.firestore
              .collection('users')
              .doc(user.name)
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
}
