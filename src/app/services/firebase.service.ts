import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
  ) {
    if (environment.useEmulators) {
      this.afs.firestore.settings({
        host: 'localhost:8080',
        ssl: false,
      });
      this.auth.useEmulator('http://localhost:9099');
    }
  }
}
