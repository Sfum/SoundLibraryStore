import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { forkJoin, from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProductService } from './product.service';
import { Sale } from '../models/sale';

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
          sale.id = Number(ref.id); // Ensure sale ID is correctly set
          this.firestore
            .collection('sales')
            .doc(ref.id)
            .update({ id: ref.id })
            .then(() => resolve())
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });
  }

  getUserId(): Observable<string | null> {
    return this.afAuth.authState.pipe(map((user) => (user ? user.uid : null)));
  }

  handlePurchase(): Observable<void> {
    return this.getUserId().pipe(
      switchMap((uploaderId) => {
        if (!uploaderId) {
          return throwError('User not authenticated');
        }

        return this.firestore
          .collection<any>('sales')
          .valueChanges()
          .pipe(
            switchMap((cartItems) => {
              const saleObservables: Observable<void>[] = cartItems.map(
                (cartItem: any) => {
                  return this.productService.getProduct(cartItem.id).pipe(
                    switchMap((product) => {
                      if (!product) {
                        console.error(`Product found for ID: ${cartItem.id}`);
                        return throwError(
                          `Product not found for ID: ${cartItem.id}`,
                        );
                      }

                      const sale: Sale = {
                        id: cartItem.id,
                        productId: cartItem.productId,
                        quantitySold: cartItem.quantity,
                        saleDate: new Date(),
                        uploaderId: uploaderId,
                        product_name: product.product_name,
                        totalPrice: cartItem.totalPrice,
                      };
                      console.log('Logging sale:', sale); // Check if this line logs

                      return from(this.logSale(sale));
                    }),
                    catchError((error) => {
                      console.error('Error fetching product: ', error);
                      return throwError('Error fetching product');
                    }),
                  );
                },
              );

              console.log('Sale observables:', saleObservables); // Add this line to log saleObservables
              return forkJoin(saleObservables).pipe(map(() => {}));
            }),
            catchError((error) => {
              console.error('Error fetching cart items: ', error);
              return throwError('Error fetching cart items');
            }),
          );
      }),
      catchError((error) => {
        console.error('Error handling purchase:', error);
        return throwError('Error processing purchase');
      }),
    );
  }

  getAllSales(): Observable<Sale[]> {
    return this.firestore.collection<Sale>('sales').valueChanges();
  }

  getSalesByUploader(uploaderId: string): Observable<Sale[]> {
    return this.firestore
      .collection<Sale>('sales', (ref) =>
        ref.where('uploaderId', '==', uploaderId),
      )
      .valueChanges();
  }
}
