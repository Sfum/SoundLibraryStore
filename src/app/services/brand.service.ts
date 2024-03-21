import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private firestore: AngularFirestore) {}

  getBrands(): Observable<any[]> {
    return this.firestore.collection('brands').valueChanges();
  }

  brands$ = this.getBrands()
}
