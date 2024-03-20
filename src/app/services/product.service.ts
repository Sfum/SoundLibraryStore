import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: AngularFirestore) {}

  getProductCollection(): Observable<any[]> {
    return this.firestore.collection('products').valueChanges();
  }

  products$ = this.getProductCollection()
}
