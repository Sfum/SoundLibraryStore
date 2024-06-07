import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Sale } from '../models/sale';
import {
  catchError,
  EMPTY,
  from,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  constructor(
    private firestore: AngularFirestore,
    private productService: ProductService,
    private afAuth: AngularFireAuth,
  ) {}

  logSale(sale: Sale): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore
        .collection('sales')
        .add(sale)
        .then((ref) => {
          sale.id = +ref.id;
          this.firestore
            .collection('sales')
            .doc(ref.id)
            .update({ id: ref.id })
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getAllSales(): Observable<Sale[]> {
    return this.firestore.collection<Sale>('sales').valueChanges();
  }

  getSalesByUploader(uploaderId: string): Observable<Sale[]> {
    return this.firestore
      .collection<Sale>('sales', (ref) =>
        ref.where('uploaderId', '==', uploaderId),
      )
      .valueChanges()
      .pipe(
        switchMap((sales) => {
          const productIds = sales.map((sale) => sale.productId.toString());
          return this.productService.getProductsByIds(productIds).pipe(
            map((products) =>
              sales.map((sale) => ({
                ...sale,
                product_name:
                  products.find((p) => p.id === sale.productId)?.product_name ||
                  'Unknown Product',
              })),
            ),
          );
        }),
      );
  }

  getUserId(): Observable<string | null> {
    return this.afAuth.authState.pipe(map((user) => (user ? user.uid : null)));
  }

  handlePurchase(): Observable<Awaited<unknown>[]> {
    const uploaderId = this.getUserId();
    const salesData = JSON.parse(localStorage.getItem('cart') || '[]');

    const salePromises = salesData.map((saleItem: any) => {
      const sale = {
        productId: saleItem.productId,
        quantitySold: saleItem.quantitySold,
        saleDate: new Date(),
        uploaderId: uploaderId || '',
        product_name: saleItem.product_name,
        totalPrice: saleItem.totalPrice,
      };

      return this.firestore
        .collection('sales')
        .add(sale)
        .then((ref) => {
          return this.firestore
            .collection('sales')
            .doc(ref.id)
            .update({ id: ref.id });
        });
    });

    // Convert the array of promises to an Observable<void>
    return from(Promise.all(salePromises)).pipe(
      // Catch any errors during the promise execution
      catchError((error) => {
        console.error('Error handling purchase:', error);
        // Return an empty observable to signify failure
        return EMPTY;
      }),
    );
  }
}
