import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { forkJoin, from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProductService } from './product.service';
import { Sale } from '../models/sale';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  constructor(
    private firestore: AngularFirestore,
    private productService: ProductService,
    private afAuth: AngularFireAuth,
  ) {}

  getUserId(): Observable<string | null> {
    return this.afAuth.authState.pipe(map((user) => (user ? user.uid : null)));
  }

  logSale(products: Product[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Get the user ID
      this.getUserId().subscribe((uploaderId) => {
        if (!uploaderId) {
          reject('User not authenticated');
        } else {
          // Create a new sale object
          const sale: Sale = {
            // @ts-ignore

            id: '', // Let Firestore generate an ID
            saleDate: new Date(), // Set the sale date to the current date/time
            uploaderId: uploaderId, // Set the uploaderId to the current user's ID
            product_name: '', // Not necessary, can be removed
            totalPrice: 0, // To be calculated later
            products: products, // Array of products in the sale
          };

          // Calculate total price based on the products in the sale
          // @ts-ignore
          sale.totalPrice = products.reduce(
            (total, product) => total + product.price,
            0,
          );

          // Add the sale to the user's cart collection
          this.firestore
            .collection(`users/${uploaderId}/cart`)
            .add(sale)
            .then(() => resolve())
            .catch((error) => reject(error));
        }
      });
    });
  }

  handlePurchase(): Observable<void> {
    return this.getUserId().pipe(
      switchMap((uploaderId) => {
        if (!uploaderId) {
          return throwError('User not authenticated');
        }

        return this.firestore
          .collection<any>(`users/${uploaderId}/cart`)
          .valueChanges()
          .pipe(
            switchMap((cartItems) => {
              const productObservables: Observable<Product | undefined>[] =
                cartItems.map((cartItem: any) =>
                  this.productService.getProduct(cartItem.productId),
                );

              return forkJoin(productObservables).pipe(
                switchMap((products) => {
                  const validProducts = products.filter((product) => !!product);
                  if (validProducts.length !== cartItems.length) {
                    console.error('Some products not found');
                    return throwError('Some products not found');
                  }

                  // Call logSale with the array of valid products
                  // @ts-ignore
                  return from(this.logSale(validProducts));
                }),
              );
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

  getAllSales(uploaderId: string): Observable<Sale[]> {
    return this.firestore
      .collection<Sale>(`users/${uploaderId}/cart`)
      .valueChanges();
  }

  getSalesByUploader(uploaderId: string): Observable<Sale[]> {
    return this.firestore
      .collection<Sale>(`users/${uploaderId}/cart`, (ref) =>
        ref.where('uploaderId', '==', uploaderId),
      )
      .valueChanges();
  }
}
