import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {Product} from "../models/product";
import {Brand} from "../models/brand";

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private firestore: AngularFirestore) {}

  getBrands(): Observable<any[]> {
    return this.firestore.collection('brands').valueChanges();
  }

  addBrand(brand: Brand): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.collection('brands')
        .add(brand)
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  brands$ = this.getBrands()
}
