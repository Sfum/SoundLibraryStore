import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { SnackbarService } from './snackbar.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, from, Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  products: Product[] = [];
  subTotal: number | undefined;

  constructor(
    private snackbarService: SnackbarService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) {
    this.loadCart();
  }

  addToCart(product: Product) {
    if (!this.productInCart(product)) {
      product.quantity = 1;
      this.addProductToCart(product);
      this.products = [...this.getProduct()];
      this.subTotal = product.price;
      product.in_cart = !product.in_cart;
      this.snackbarService.showSnackbar(
        `\`${product.product_name}\` by \`${product.brandId}\` added to Cart`,
      );
    } else {
      this.snackbarService.showSnackbar('Product Already In Cart');
    }
  }

  addProductToCart(addedProduct: Product) {
    this.products.push(addedProduct);
    this.saveCart();
  }

  getProduct() {
    return this.products;
  }

  saveCart(): void {
    localStorage.setItem('total_price', JSON.stringify(this.products));
  }

  loadCart(): void {
    this.products =
      JSON.parse(localStorage.getItem('total_price') as any) || [];
  }

  productInCart(product: any): boolean {
    return this.products.findIndex((x: any) => x.id === product.id) > -1;
  }

  removeProduct(product: any) {
    const index = this.products.findIndex((x: any) => x.id === product.id);
    if (index > -1) {
      this.products.splice(index, 1);
      this.saveCart();
    }
  }

  addWishlistToCart(product: any) {
    if (!this.productInCart(product)) {
      product.quantity = 1;
      this.addToCart(product);
    } else {
      alert('Item Already In Cart');
    }
  }

  clearCart(): void {
    localStorage.removeItem('total_price');
    this.products = [];
  }

  syncCartWithFirestore(): Observable<void> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Create a batch operation
        const batch = this.firestore.firestore.batch();

        // Retrieve a reference to the 'sales' collection
        const salesRef = this.firestore.collection('sales').ref;

        // Iterate over each product in the cart
        this.products.forEach((product) => {
          // Create a new sale object
          const sale: Sale = {
            // @ts-ignore
            id: '', // Let Firestore generate an ID
            productId: product.id, // Assuming product.id is the product ID
            quantitySold: product.quantity, // Assuming product.quantity is the quantity in the cart
            saleDate: new Date(), // Set the sale date to the current date/time
            uploaderId: user.uid, // Set the user ID as the uploader
            product_name: product.product_name, // Assuming product.product_name is the product name
            totalPrice: product.price, // Assuming product.totalPrice is the total price
          };

          // Add a set operation to the batch for each sale
          const docRef = salesRef.doc(); // Firestore will generate a unique ID for each sale
          batch.set(docRef, sale);
        });

        // Commit the batch operation
        return from(batch.commit());
      }),
      catchError((error) => {
        console.error('Error syncing cart with Firestore:', error);
        return throwError('Error syncing cart with Firestore');
      }),
    );
  }
}
