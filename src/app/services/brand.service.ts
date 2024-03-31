import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {catchError, Observable, throwError} from "rxjs";
import {Brand} from "../models/brand";

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  brands$ = this.getBrands()

  constructor(private firestore: AngularFirestore) {}

  getBrands(): Observable<any[]> {
    return this.firestore.collection('brands').valueChanges();
  }
  getBrand(id: string): Observable<Brand | undefined> {
    const brandRef = this.firestore.collection('brands').doc<Brand>(id.toString());

    return brandRef.valueChanges().pipe(
      catchError((error) => {
        console.error('Error getting brand: ', error);
        return throwError('Something went wrong while fetching the brand');
      })
    );
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
  updateBrand(brandId: string, brand: Brand): Observable<void> {
    return new Observable((observer) => {
      this.firestore.collection('brands').doc(brandId).update(brand)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Error updating brand: ', error);
          observer.error('Something went wrong while updating the brand');
        });
    });
  }

}
