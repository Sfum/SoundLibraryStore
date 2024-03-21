import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private firestore: AngularFirestore) {}

  getGenres(): Observable<any[]> {
    return this.firestore.collection('genres').valueChanges();
  }

  genres$ = this.getGenres()
}
