import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  constructor(private firestore: AngularFirestore) {}

  getTypes(): Observable<any[]> {
    return this.firestore.collection('types').valueChanges();
  }

  types$ = this.getTypes()
}
