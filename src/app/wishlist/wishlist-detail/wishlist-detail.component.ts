import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../../models/product";
import {Router} from "@angular/router";

@Component({
  selector: 'app-wishlist-detail',
  templateUrl: './wishlist-detail.component.html',
  styleUrl: './wishlist-detail.component.sass'
})
export class WishlistDetailComponent {

  @Input()  products!: Product[];
  @Output() addToCartEvent: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() removeWishlistEvent: EventEmitter<Product> = new EventEmitter<Product>();

  constructor(
    public router: Router) {
  }

  addProductToCart(product: Product) {
    this.addToCartEvent.emit(product);
  }

  removeFromWishlist(product: Product) {
    this.removeWishlistEvent.emit(product);
  }

}
