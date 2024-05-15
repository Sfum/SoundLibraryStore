import { Injectable } from '@angular/core';
import {SnackbarService} from "./snackbar.service";

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private snackbarService: SnackbarService) {}

  products: any[] = [];

  addToWishlist(product: any) {
    if (!this.productInCart(product)) {
      product.quantity = 1;
      this.addProductToWishlist(product);
      this.products = [...this.getProduct()];
      this.snackbarService.showSnackbar(`\`${product.product_name}\` by \`${product.brandId}\` added to Wishlist`);
      product.in_wishlist = !product.in_wishlist;
    } else {
      this.snackbarService.showSnackbar('Item is Already In Wishlist');
    }
  }
  getProduct() {
    return this.products;
  }
  addProductToWishlist(addedProduct: any) {
    this.products.push(addedProduct);
    this.saveCart();
  }
  saveCart(): void {
    localStorage.setItem('wishlist_items', JSON.stringify(this.products));
  }
  loadCart(): void {
    this.products =
      JSON.parse(localStorage.getItem('wishlist_items') as any) || [];
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
}
