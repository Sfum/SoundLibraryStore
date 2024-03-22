import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Product} from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: AngularFirestore) {}

  getProducts(): Observable<any[]> {
    return this.firestore.collection('products',).valueChanges();
  }

  products$ = this.getProducts()

  getProduct(productId: number): Observable<Product | undefined> {
    const productRef = this.firestore.collection('products').doc<Product>(productId.toString());

    return productRef.valueChanges().pipe(
      catchError((error) => {
        console.error('Error getting product: ', error);
        return throwError('Something went wrong while fetching the product');
      })
    );
  }

  addProduct(product: Product): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.collection('products')
        .add(product)
        .then(ref => {
          product.id = +ref.id;
          this.firestore.collection('products')
            .doc(ref.id).update({id: ref.id})
            .then(() => {
              resolve()
            }).catch(error => {
            reject(error);
          });
        }).catch(error => {
        reject(error);
      });
    });
  }

}
