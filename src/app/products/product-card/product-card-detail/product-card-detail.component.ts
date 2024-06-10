import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-product-card-detail',
  templateUrl: './product-card-detail.component.html',
  styleUrl: './product-card-detail.component.sass',
})
export class ProductCardDetailComponent {
  @Input() products!: Product[];
  @Input() product!: Product;
  @Output() addToWishlistEvent: EventEmitter<Product> =
    new EventEmitter<Product>();
  @Output() addToCartEvent: EventEmitter<Product> = new EventEmitter<Product>();

  addToWishlist(product: Product) {
    this.addToWishlistEvent.emit(product);
  }

  addToCart(product: Product) {
    this.addToCartEvent.emit(product);
  }
}
