import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Format } from '../models/format';

@Injectable({
  providedIn: 'root',
})
export class FormatService {
  constructor(private firestore: AngularFirestore) {}

  getFormats(): Observable<Format[]> {
    return this.firestore.collection<Format>('formats').valueChanges();
  }
}
